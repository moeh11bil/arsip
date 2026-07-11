export const categoryColors: Record<string, string> = {
  'Surat Masuk': 'bg-blue-100 text-blue-800',
  'Surat Keluar': 'bg-purple-100 text-purple-800',
  'SK': 'bg-green-100 text-green-800',
  'Piagam': 'bg-yellow-100 text-yellow-800',
  'Berita Acara': 'bg-red-100 text-red-800',
  'Notulis': 'bg-gray-100 text-gray-800',
  'Undangan': 'bg-indigo-100 text-indigo-800',
  'Lainnya': 'bg-gray-100 text-gray-800',
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function getFileExtension(mimeType?: string | null): string {
  const map: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  }
  return map[mimeType || ''] || 'pdf'
}
