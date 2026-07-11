import type { Document, DocumentCategory, DocumentStatus } from '@prisma/client'

interface DocumentFilters {
  page?: number
  limit?: number
  search?: string
  kategori?: DocumentCategory
  status?: DocumentStatus
  startDate?: string
  endDate?: string
}

interface DocumentListResponse {
  data: Document[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const useDocuments = () => {
  const list = async (filters: DocumentFilters = {}) => {
    const query = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value))
      }
    })

    return await $fetch<DocumentListResponse>(`/api/documents?${query.toString()}`)
  }

  const getById = async (id: string) => {
    return await $fetch<{ data: Document }>(`/api/documents/${id}`)
  }

  const upload = async (formData: FormData) => {
    return await $fetch('/api/documents', {
      method: 'POST',
      body: formData,
    })
  }

  const update = async (id: string, data: Partial<Document>) => {
    return await $fetch(`/api/documents/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  const remove = async (id: string) => {
    return await $fetch(`/api/documents/${id}`, { method: 'DELETE' })
  }

  const download = async (id: string) => {
    const response = await $fetch<Blob>(`/api/documents/${id}/download`, {
      responseType: 'blob',
    })
    return response
  }

  return { list, getById, upload, update, remove, download }
}
