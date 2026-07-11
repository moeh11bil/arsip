import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

export default defineNitroPlugin(() => {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
})

export const getPrisma = (): PrismaClient => {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient()
  }
  return globalThis.__prisma
}
