import type { PrismaClient } from '@prisma/client'

interface NotifikasiData {
  userId: string
  title: string
  message: string
  type?: string
  link?: string
}

export const createNotifikasi = async (prisma: PrismaClient, data: NotifikasiData) => {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      link: data.link,
    },
  })
}

export const createNotifikasiBulk = async (
  prisma: PrismaClient,
  dataList: NotifikasiData[],
) => {
  return prisma.notification.createMany({
    data: dataList.map(d => ({
      userId: d.userId,
      title: d.title,
      message: d.message,
      type: d.type || 'info',
      link: d.link,
    })),
  })
}
