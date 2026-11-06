import pkg from '@prisma/client'
const { PrismaClient: PrismaClientCtor } = pkg
type PrismaClient = InstanceType<typeof PrismaClientCtor>

declare global {
  var __prisma: PrismaClient | undefined
}

export default defineNitroPlugin(() => {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClientCtor({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
})

export const getPrisma = (): PrismaClient => {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClientCtor()
  }
  return globalThis.__prisma
}
