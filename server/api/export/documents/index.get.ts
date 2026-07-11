import { getPrisma } from '~/server/utils/prisma'
import PDFDocument from 'pdfkit'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Hanya admin yang dapat melakukan export' })
  }

  const query = getQuery(event)
  const format = (query.format as string) || 'xlsx'
  const kategori = query.kategori as string
  const startDate = query.startDate as string
  const endDate = query.endDate as string
  const limit = Math.min(Number(query.limit) || 10000, 10000)

  const prisma = getPrisma()

  const where: any = { deletedAt: null }
  if (kategori) where.kategori = kategori
  if (startDate || endDate) {
    where.tanggalDokumen = {}
    if (startDate) where.tanggalDokumen.gte = new Date(startDate)
    if (endDate) where.tanggalDokumen.lte = new Date(endDate)
  }

  const documents = await prisma.document.findMany({
    where,
    include: {
      createdBy: { select: { namaLengkap: true } },
      tags: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  if (format === 'xlsx') {
    return await exportXLSX(event, documents)
  }
  if (format === 'pdf') {
    return await exportPDF(event, documents)
  }
  return await exportHTML(event, documents)
})

async function exportXLSX(event: any, documents: any[]) {
  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Arsip Dokumen')

  sheet.columns = [
    { header: 'Kode Dokumen', key: 'kodeDokumen', width: 25 },
    { header: 'Judul', key: 'judul', width: 40 },
    { header: 'Kategori', key: 'kategori', width: 20 },
    { header: 'Sub Kategori', key: 'subKategori', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Level Akses', key: 'accessLevel', width: 15 },
    { header: 'Tanggal Dokumen', key: 'tanggalDokumen', width: 15 },
    { header: 'Ukuran File', key: 'fileSize', width: 15 },
    { header: 'Dibuat Oleh', key: 'createdBy', width: 25 },
    { header: 'Tanggal Dibuat', key: 'createdAt', width: 20 },
    { header: 'Masa Retensi', key: 'masaRetensiThn', width: 15 },
    { header: 'Tag', key: 'tags', width: 30 },
  ]

  sheet.getRow(1).font = { bold: true, size: 12 }

  documents.forEach((doc: any) => {
    sheet.addRow({
      kodeDokumen: doc.kodeDokumen,
      judul: doc.judul,
      kategori: doc.kategori,
      subKategori: doc.subKategori || '-',
      status: doc.status,
      accessLevel: doc.accessLevel,
      tanggalDokumen: doc.tanggalDokumen
        ? new Date(doc.tanggalDokumen).toLocaleDateString('id-ID')
        : '-',
      fileSize: `${(doc.fileSize / 1024).toFixed(1)} KB`,
      createdBy: doc.createdBy?.namaLengkap || '-',
      createdAt: new Date(doc.createdAt).toLocaleDateString('id-ID'),
      masaRetensiThn: `${doc.masaRetensiThn} tahun`,
      tags: doc.tags?.map((t: any) => t.tag).join(', ') || '-',
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()

  setResponseHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="arsip-dokumen-${new Date().toISOString().split('T')[0]}.xlsx"`)
  return buffer
}

async function exportPDF(event: any, documents: any[]) {
  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' })

  setResponseHeader(event, 'Content-Type', 'application/pdf')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="arsip-dokumen-${new Date().toISOString().split('T')[0]}.pdf"`)

  doc.pipe(event.node.res)

  doc.fontSize(16).text('Laporan Arsip Dokumen', { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(9).text(`Dibuat: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' })
  doc.moveDown(1)

  const columns = [
    { header: 'Kode', width: 65 },
    { header: 'Judul', width: 160 },
    { header: 'Kategori', width: 70 },
    { header: 'Status', width: 55 },
    { header: 'Akses', width: 55 },
    { header: 'Tanggal', width: 65 },
    { header: 'Ukuran', width: 50 },
    { header: 'Dibuat Oleh', width: 80 },
  ]

  const drawTableHeader = (y: number) => {
    let x = 30
    doc.fontSize(7).font('Helvetica-Bold')
    columns.forEach(col => {
      doc.rect(x, y, col.width, 16).fill('#4f46e5')
      doc.fill('#ffffff').text(col.header, x + 3, y + 4, { width: col.width - 6, align: 'left' })
      x += col.width
    })
    doc.fill('#000000')
    return y + 16
  }

  let y = drawTableHeader(doc.y)
  let row = 0

  const pageHeight = 550

  documents.forEach((d: any) => {
    if (y + 20 > pageHeight) {
      doc.addPage()
      y = drawTableHeader(30)
    }

    let x = 30
    doc.font('Helvetica').fontSize(6)
    const bg = row % 2 === 0 ? '#f9fafb' : '#ffffff'

    columns.forEach(col => {
      doc.rect(x, y, col.width, 14).fill(bg)
      x += col.width
    })
    doc.fill('#000000')

    x = 30
    const vals = [
      d.kodeDokumen,
      d.judul,
      d.kategori,
      d.status,
      d.accessLevel,
      new Date(d.tanggalDokumen).toLocaleDateString('id-ID'),
      `${(d.fileSize / 1024).toFixed(0)} KB`,
      d.createdBy?.namaLengkap || '-',
    ]

    vals.forEach((val, i) => {
      doc.text(String(val), x + 2, y + 2, { width: columns[i].width - 4, align: 'left' })
      x += columns[i].width
    })

    y += 14
    row++
  })

  doc.end()
  return new Promise<void>((resolve) => {
    doc.on('end', () => resolve())
  })
}

async function exportHTML(event: any, documents: any[]) {
  const rows = documents.map((d: any) => {
    const kode = escapeHtml(d.kodeDokumen || '')
    const judul = escapeHtml(d.judul || '')
    const kategori = escapeHtml(d.kategori || '')
    const status = escapeHtml(d.status || '')
    const tanggal = escapeHtml(new Date(d.tanggalDokumen).toLocaleDateString('id-ID'))
    const pembuat = escapeHtml(d.createdBy?.namaLengkap || '-')
    return `<tr><td>${kode}</td><td>${judul}</td><td>${kategori}</td><td>${status}</td><td>${tanggal}</td><td>${pembuat}</td></tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: sans-serif; padding: 20px; }
  h1 { text-align: center; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
  th { background: #f5f5f5; font-weight: bold; }
</style></head><body>
  <h1>Laporan Arsip Dokumen</h1>
  <table>
    <tr><th>Kode</th><th>Judul</th><th>Kategori</th><th>Status</th><th>Tanggal</th><th>Dibuat Oleh</th></tr>
    ${rows}
  </table>
  <p style="text-align:right;margin-top:20px;color:#666;">Dibuat: ${escapeHtml(new Date().toLocaleDateString('id-ID'))}</p>
</body></html>`

  setResponseHeader(event, 'Content-Type', 'text/html')
  setResponseHeader(event, 'Content-Disposition', `attachment; filename="arsip-dokumen-${new Date().toISOString().split('T')[0]}.html"`)
  return html
}
