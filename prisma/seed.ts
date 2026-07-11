import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ========== USERS ==========
  const adminPassword = await bcrypt.hash('admin123456', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sekolah.sch.id' },
    update: {},
    create: {
      email: 'admin@sekolah.sch.id',
      passwordHash: adminPassword,
      namaLengkap: 'Administrator',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })
  console.log(`Admin user: ${admin.email} (password: admin123456)`)

  const tuPassword = await bcrypt.hash('tu123456', 12)

  const tu = await prisma.user.upsert({
    where: { email: 'tu@sekolah.sch.id' },
    update: {},
    create: {
      email: 'tu@sekolah.sch.id',
      passwordHash: tuPassword,
      namaLengkap: 'Staf Tata Usaha',
      nip: '198501012010012001',
      role: 'TU',
      isActive: true,
    },
  })
  console.log(`TU user: ${tu.email} (password: tu123456)`)

  // ========== KLASIFIKASI ARSIP (HIERARCHY) ==========
  // Main categories (parent = null)
  const mainCategories = [
    { kode: 'AKD', nama: 'Dokumen Akademik', kategori: 'AKADEMIK', retensiThn: 10, deskripsi: 'Dokumen terkait kegiatan akademik sekolah' },
    { kode: 'KSW', nama: 'Dokumen Kesiswaan', kategori: 'KESISWAAN', retensiThn: 10, deskripsi: 'Dokumen terkait data dan kegiatan siswa' },
    { kode: 'KEP', nama: 'Dokumen Kepegawaian', kategori: 'KEPEGAWAIAN', retensiThn: 25, deskripsi: 'Dokumen terkait guru dan staf' },
    { kode: 'ADM', nama: 'Dokumen Administratif', kategori: 'ADMINISTRATIF', retensiThn: 10, deskripsi: 'Dokumen administrasi dan tata usaha' },
    { kode: 'KEU', nama: 'Dokumen Keuangan', kategori: 'KEUANGAN', retensiThn: 15, deskripsi: 'Dokumen terkait keuangan sekolah' },
    { kode: 'LEG', nama: 'Dokumen Legalitas', kategori: 'LEGALITAS', retensiThn: 25, deskripsi: 'Dokumen hukum dan perizinan' },
    { kode: 'MED', nama: 'Media & Dokumentasi', kategori: 'MEDIA', retensiThn: 5, deskripsi: 'Foto, video, dan dokumentasi acara' },
    { kode: 'LAIN', nama: 'Lainnya', kategori: 'LAINNYA', retensiThn: 5, deskripsi: 'Dokumen lain yang tidak termasuk kategori di atas' },
  ]

  const mainRecords: Record<string, string> = {}
  for (const m of mainCategories) {
    const record = await prisma.klasifikasiArsip.upsert({
      where: { kode: m.kode },
      update: { nama: m.nama, kategori: m.kategori as any, retensiThn: m.retensiThn, deskripsi: m.deskripsi },
      create: { ...m, kategori: m.kategori as any },
    })
    mainRecords[m.kategori] = record.id
    mainRecords[m.kode] = record.id
  }

  // Subcategories (parent = main category)
  const subCategories = [
    // Akademik
    { kode: 'AKD.01', nama: 'Rapor & Transkrip Nilai', parentKode: 'AKD', retensiThn: 10 },
    { kode: 'AKD.02', nama: 'Ijazah & SKL', parentKode: 'AKD', retensiThn: 20 },
    { kode: 'AKD.03', nama: 'Silabus & RPP/Modul Ajar', parentKode: 'AKD', retensiThn: 5 },
    { kode: 'AKD.04', nama: 'Jadwal Pelajaran', parentKode: 'AKD', retensiThn: 5 },
    { kode: 'AKD.05', nama: 'Daftar Hadir Siswa', parentKode: 'AKD', retensiThn: 5 },

    // Kesiswaan
    { kode: 'KSW.01', nama: 'Formulir Pendaftaran', parentKode: 'KSW', retensiThn: 5 },
    { kode: 'KSW.02', nama: 'Akta Kelahiran & KK Siswa', parentKode: 'KSW', retensiThn: 10 },
    { kode: 'KSW.03', nama: 'Surat Keterangan Pindah', parentKode: 'KSW', retensiThn: 5 },
    { kode: 'KSW.04', nama: 'Data Prestasi & Ekstrakurikuler', parentKode: 'KSW', retensiThn: 5 },

    // Kepegawaian
    { kode: 'KEP.01', nama: 'SK Pengangkatan', parentKode: 'KEP', retensiThn: 25 },
    { kode: 'KEP.02', nama: 'Sertifikat Pendidik', parentKode: 'KEP', retensiThn: 25 },
    { kode: 'KEP.03', nama: 'Daftar Gaji & Tunjangan', parentKode: 'KEP', retensiThn: 10 },
    { kode: 'KEP.04', nama: 'Penilaian Kinerja', parentKode: 'KEP', retensiThn: 5 },
    { kode: 'KEP.05', nama: 'Data Pribadi Guru/Staff', parentKode: 'KEP', retensiThn: 10 },

    // Administratif
    { kode: 'ADM.01', nama: 'Surat Masuk & Surat Keluar', parentKode: 'ADM', retensiThn: 5 },
    { kode: 'ADM.02', nama: 'Nota Dinas & Memo Internal', parentKode: 'ADM', retensiThn: 5 },
    { kode: 'ADM.03', nama: 'MoU & Kerja Sama', parentKode: 'ADM', retensiThn: 10 },
    { kode: 'ADM.04', nama: 'Peraturan & Kebijakan Sekolah', parentKode: 'ADM', retensiThn: 10 },

    // Keuangan
    { kode: 'KEU.01', nama: 'RAPBS', parentKode: 'KEU', retensiThn: 10 },
    { kode: 'KEU.02', nama: 'Laporan BOS', parentKode: 'KEU', retensiThn: 10 },
    { kode: 'KEU.03', nama: 'Kwitansi & Faktur', parentKode: 'KEU', retensiThn: 5 },
    { kode: 'KEU.04', nama: 'Laporan Audit', parentKode: 'KEU', retensiThn: 15 },

    // Legalitas
    { kode: 'LEG.01', nama: 'Akta Pendirian / Izin Operasional', parentKode: 'LEG', retensiThn: 25 },
    { kode: 'LEG.02', nama: 'Dokumen Akreditasi', parentKode: 'LEG', retensiThn: 10 },
    { kode: 'LEG.03', nama: 'Sertifikat Tanah/Bangunan', parentKode: 'LEG', retensiThn: 25 },

    // Media
    { kode: 'MED.01', nama: 'Foto Kegiatan', parentKode: 'MED', retensiThn: 5 },
    { kode: 'MED.02', nama: 'Video', parentKode: 'MED', retensiThn: 5 },
    { kode: 'MED.03', nama: 'Dokumentasi Acara', parentKode: 'MED', retensiThn: 10 },

    // Lainnya
    { kode: 'LAIN.01', nama: 'Dokumen Lainnya', parentKode: 'LAIN', retensiThn: 5 },
  ]

  for (const s of subCategories) {
    const parentId = mainRecords[s.parentKode]
    if (!parentId) {
      console.warn(`Parent not found for ${s.kode}, skipping`)
      continue
    }
    await prisma.klasifikasiArsip.upsert({
      where: { kode: s.kode },
      update: {
        nama: s.nama,
        parentId,
        retensiThn: s.retensiThn,
        deskripsi: s.nama,
      },
      create: {
        kode: s.kode,
        nama: s.nama,
        deskripsi: s.nama,
        kategori: mainCategories.find(m => m.kode === s.parentKode)!.kategori as any,
        retensiThn: s.retensiThn,
        parentId,
      },
    })
  }

  const totalKlasifikasi = mainCategories.length + subCategories.length
  console.log(`Klasifikasi arsip: ${totalKlasifikasi} data (${mainCategories.length} utama + ${subCategories.length} sub)`)

  // ========== UNIT KERJA ==========
  const unitKerja = [
    { kode: 'U001', nama: 'Kepala Sekolah' },
    { kode: 'U002', nama: 'Tata Usaha' },
    { kode: 'U003', nama: 'Kurikulum' },
    { kode: 'U004', nama: 'Kesiswaan' },
    { kode: 'U005', nama: 'Sarana Prasarana' },
  ]

  for (const u of unitKerja) {
    await prisma.unitKerja.upsert({
      where: { kode: u.kode },
      update: {},
      create: u,
    })
  }

  console.log(`Unit kerja: ${unitKerja.length} data`)
  console.log('Seed selesai!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
