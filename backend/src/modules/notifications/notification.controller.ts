import { Request, Response } from 'express';
import { NotificationService } from './notification.service';

const notificationService = new NotificationService();

export class NotificationController {
  async getMyNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const notifications = await notificationService.getUserNotifications(userId);
      return res.json(notifications);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async markRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const notification = await notificationService.markAsRead(id);
      return res.json(notification);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async markAllRead(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await notificationService.markAllAsRead(userId);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getLogs(req: Request, res: Response) {
    try {
      const { assetId } = req.query;
      let userId = req.query.userId as string;
      
      if (req.user?.role === 'USER') {
        userId = req.user.id;
      }

      const logs = await notificationService.getActivityLogs({
        assetId: assetId as string,
        userId: userId,
      });
      return res.json(logs);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
