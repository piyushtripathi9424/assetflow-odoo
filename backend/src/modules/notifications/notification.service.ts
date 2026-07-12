import prisma from '../../utils/prisma';

export class NotificationService {
  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getActivityLogs(filters?: { assetId?: string; userId?: string }) {
    const where: any = {};
    if (filters?.assetId) where.assetId = filters.assetId;
    if (filters?.userId) where.userId = filters.userId;

    return prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: true, asset: true },
    });
  }
}
