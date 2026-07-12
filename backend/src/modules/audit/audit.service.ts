import prisma from '../../utils/prisma';

export class AuditService {
  async startAudit(data: { name: string; auditorId: string; assetIds: string[] }) {
    const { name, auditorId, assetIds } = data;

    const audit = await prisma.audit.create({
      data: {
        name,
        auditorId,
        startDate: new Date(),
        status: 'IN_PROGRESS',
        items: {
          create: assetIds.map(assetId => ({
            assetId,
            status: 'UNVERIFIED',
          })),
        },
      },
      include: { items: true },
    });

    await prisma.activityLog.create({
      data: {
        userId: auditorId,
        action: 'AUDIT_STARTED',
        description: `Started audit ${name} with ${assetIds.length} assets.`,
      },
    });

    return audit;
  }

  async verifyAsset(auditItemId: string, auditorId: string, status: 'VERIFIED' | 'DISCREPANCY', notes?: string, discrepancyType?: 'MISSING' | 'DAMAGED' | 'LOCATION_MISMATCH') {
    // Check if audit is locked
    const currentItem = await prisma.auditItem.findUnique({ where: { id: auditItemId }, include: { audit: true } });
    
    if (!currentItem) throw new Error('Audit item not found');
    if (currentItem.audit.status === 'CLOSED') throw new Error('Cannot verify asset. Audit is already closed.');

    const item = await prisma.auditItem.update({
      where: { id: auditItemId },
      data: {
        status,
        notes,
        discrepancyType,
        verifiedAt: new Date(),
      },
    });

    // If it's a discrepancy, automatically log it and update asset status if applicable
    if (status === 'DISCREPANCY' && discrepancyType) {
      if (discrepancyType === 'MISSING') {
        await prisma.asset.update({ where: { id: item.assetId }, data: { status: 'MISSING' } });
      } else if (discrepancyType === 'DAMAGED') {
        await prisma.asset.update({ where: { id: item.assetId }, data: { status: 'DAMAGED' } });
      }

      await prisma.activityLog.create({
        data: {
          userId: auditorId,
          assetId: item.assetId,
          action: 'AUDIT_DISCREPANCY_FOUND',
          description: `Discrepancy found during audit: ${discrepancyType} - ${notes || 'No notes'}`,
        },
      });
    }

    return item;
  }

  async closeAudit(auditId: string, auditorId: string) {
    const audit = await prisma.audit.update({
      where: { id: auditId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
      },
      include: { items: true },
    });

    await prisma.activityLog.create({
      data: {
        userId: auditorId,
        action: 'AUDIT_CLOSED',
        description: `Audit ${audit.name} closed.`,
      },
    });

    return audit;
  }

  async getDiscrepancyReport(auditId: string) {
    const items = await prisma.auditItem.findMany({
      where: {
        auditId,
        status: 'DISCREPANCY',
      },
      include: { asset: true },
    });

    return items;
  }

  async getAudits() {
    return prisma.audit.findMany({
      include: { auditor: true, _count: { select: { items: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAuditDetails(auditId: string) {
    return prisma.audit.findUnique({
      where: { id: auditId },
      include: { items: { include: { asset: true } }, auditor: true },
    });
  }
}
