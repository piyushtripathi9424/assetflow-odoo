import prisma from '../../utils/prisma';

export class MaintenanceService {
  async createRequest(data: { assetId: string; requesterId: string; issue: string }) {
    const { assetId, requesterId, issue } = data;

    const request = await prisma.maintenanceRequest.create({
      data: {
        assetId,
        requesterId,
        issue,
        status: 'PENDING_APPROVAL',
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: requesterId,
        assetId,
        action: 'MAINTENANCE_REQUESTED',
        description: `Maintenance requested: ${issue}`,
      },
    });

    return request;
  }

  async approveRequest(requestId: string, adminId: string) {
    const request = await prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });

    // Asset automatically changes to Under Maintenance after approval.
    await prisma.asset.update({
      where: { id: request.assetId },
      data: { status: 'UNDER_MAINTENANCE' },
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        assetId: request.assetId,
        action: 'MAINTENANCE_APPROVED',
        description: `Maintenance ${requestId} approved and asset status changed to UNDER_MAINTENANCE.`,
      },
    });

    return request;
  }

  async assignTechnician(requestId: string, technicianId: string, adminId: string) {
    const request = await prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: { 
        technicianId,
        status: 'IN_PROGRESS' 
      },
    });

    await prisma.notification.create({
      data: {
        userId: technicianId,
        title: 'New Maintenance Assignment',
        message: `You have been assigned to maintenance request ${requestId}.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        assetId: request.assetId,
        action: 'TECHNICIAN_ASSIGNED',
        description: `Technician ${technicianId} assigned to request ${requestId}.`,
      },
    });

    return request;
  }

  async resolveRequest(requestId: string, technicianId: string, resolution: string, cost?: number) {
    const request = await prisma.maintenanceRequest.update({
      where: { id: requestId },
      data: { 
        status: 'RESOLVED',
        resolution,
        cost,
        resolvedAt: new Date(),
      },
    });

    // Resolved assets automatically become Available.
    await prisma.asset.update({
      where: { id: request.assetId },
      data: { status: 'AVAILABLE' },
    });

    await prisma.activityLog.create({
      data: {
        userId: technicianId,
        assetId: request.assetId,
        action: 'MAINTENANCE_RESOLVED',
        description: `Maintenance resolved: ${resolution}. Asset is now AVAILABLE.`,
      },
    });

    return request;
  }

  async getRequests() {
    return prisma.maintenanceRequest.findMany({
      include: { asset: true, requester: true, technician: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
