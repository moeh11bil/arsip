import type { PrismaClient, AuditAction } from '@prisma/client'

interface AuditLogData {
  userId: string
  action: AuditAction
  entity: string
  entityId?: string
  metadata?: Record<string, any>
  oldValue?: Record<string, any>
  newValue?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export const logAudit = async (prisma: PrismaClient, data: AuditLogData) => {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      metadata: data.metadata || {},
      oldValue: data.oldValue || undefined,
      newValue: data.newValue || undefined,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    },
  })
}
