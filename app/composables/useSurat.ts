import type { Surat, SuratType, SuratPriority, Disposisi, DisposisiStatus } from '@prisma/client'

interface SuratFilters {
  page?: number
  limit?: number
  type?: SuratType
  priority?: SuratPriority
  startDate?: string
  endDate?: string
  search?: string
}

interface SuratListResponse {
  data: Surat[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const useSurat = () => {
  const list = async (filters: SuratFilters = {}) => {
    const query = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, String(value))
      }
    })

    return await $fetch<SuratListResponse>(`/api/surat?${query.toString()}`)
  }

  const getById = async (id: string) => {
    return await $fetch<{ data: Surat }>(`/api/surat/${id}`)
  }

  const create = async (formData: FormData) => {
    return await $fetch('/api/surat', {
      method: 'POST',
      body: formData,
    })
  }

  const update = async (id: string, data: Partial<Surat>) => {
    return await $fetch(`/api/surat/${id}`, {
      method: 'PUT',
      body: data,
    })
  }

  const remove = async (id: string) => {
    return await $fetch(`/api/surat/${id}`, { method: 'DELETE' })
  }

  const getDisposisi = async (suratId: string) => {
    return await $fetch<{ data: Disposisi[] }>(`/api/surat/${suratId}/disposisi`)
  }

  const createDisposisi = async (suratId: string, data: { toUserId: string; instruksi: string; catatanRespon?: string }) => {
    return await $fetch(`/api/surat/${suratId}/disposisi`, {
      method: 'POST',
      body: data,
    })
  }

  const updateDisposisi = async (suratId: string, disposisiId: string, data: Partial<Disposisi>) => {
    return await $fetch(`/api/surat/${suratId}/disposisi/${disposisiId}`, {
      method: 'PUT',
      body: data,
    })
  }

  return { list, getById, create, update, remove, getDisposisi, createDisposisi, updateDisposisi }
}
