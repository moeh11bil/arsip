import { writeFile, mkdir, unlink } from 'node:fs/promises'
import { join, resolve } from 'path'

export const saveFile = async (fileName: string, data: Buffer, mimeType: string): Promise<string> => {
  const storagePath = resolve(useRuntimeConfig().storagePath || join(process.cwd(), 'storage'))
  const uploadDir = join(storagePath, 'uploads')

  await mkdir(uploadDir, { recursive: true })

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = join(uploadDir, safeName)

  await writeFile(filePath, data)

  return `uploads/${safeName}`
}

export const deleteFile = async (filePath: string): Promise<void> => {
  const storagePath = resolve(useRuntimeConfig().storagePath || join(process.cwd(), 'storage'))
  const fullPath = join(storagePath, filePath)
  try {
    await unlink(fullPath)
  } catch (err: any) {
    if (err.code !== 'ENOENT') throw err
  }
}
