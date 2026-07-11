import Tesseract from 'tesseract.js'

export const processOCR = async (fileBuffer: Buffer, mimeType: string): Promise<string> => {
  if (fileBuffer.length > 10 * 1024 * 1024) {
    return ''
  }

  if (!mimeType.startsWith('image/') && mimeType !== 'application/pdf') {
    return ''
  }

  try {
    const { data } = await Tesseract.recognize(
      fileBuffer,
      'eng+ind',
      { logger: () => {} },
    )
    return data.text || ''
  } catch (error) {
    console.error('OCR processing failed:', error)
    return ''
  }
}
