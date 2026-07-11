import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'path'

export const saveFile = async (fileName: string, data: Buffer, mimeType: string): Promise<string> => {
  const storagePath = useRuntimeConfig().storagePath || './storage'
  const uploadDir = join(storagePath, 'uploads')

  await mkdir(uploadDir, { recursive: true })

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = join(uploadDir, safeName)

  await writeFile(filePath, data)

  return `uploads/${safeName}`
}
