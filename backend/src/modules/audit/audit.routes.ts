import { Router } from 'express';
import { AuditController } from './audit.controller';

const router = Router();
const controller = new AuditController();

router.post('/', controller.start);
router.get('/', controller.getAll);
router.get('/:id', controller.getDetails);
router.post('/:id/close', controller.close);
router.post('/items/:itemId/verify', controller.verify);
router.get('/:id/report', controller.report);

export default router;
