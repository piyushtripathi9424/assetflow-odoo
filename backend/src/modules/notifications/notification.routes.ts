import { Router } from 'express';
import { NotificationController } from './notification.controller';

const router = Router();
const controller = new NotificationController();

router.get('/', controller.getMyNotifications);
router.post('/mark-all-read', controller.markAllRead);
router.post('/:id/read', controller.markRead);
router.get('/logs', controller.getLogs);

export default router;
