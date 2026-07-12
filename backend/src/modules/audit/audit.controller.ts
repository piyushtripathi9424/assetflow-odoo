import { Request, Response } from 'express';
import { AuditService } from './audit.service';

const auditService = new AuditService();

export class AuditController {
  async start(req: Request, res: Response) {
    try {
      const { name, assetIds } = req.body;
      const auditorId = req.user?.id;

      if (!auditorId) return res.status(401).json({ error: 'Unauthorized' });

      const audit = await auditService.startAudit({ name, auditorId, assetIds });
      return res.status(201).json(audit);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const { itemId } = req.params;
      const { status, notes, discrepancyType } = req.body;
      const auditorId = req.user?.id;

      if (!auditorId) return res.status(401).json({ error: 'Unauthorized' });

      const item = await auditService.verifyAsset(itemId, auditorId, status, notes, discrepancyType);
      return res.json(item);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async close(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const auditorId = req.user?.id;

      if (!auditorId) return res.status(401).json({ error: 'Unauthorized' });

      const audit = await auditService.closeAudit(id, auditorId);
      return res.json(audit);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async report(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const report = await auditService.getDiscrepancyReport(id);
      return res.json(report);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const audits = await auditService.getAudits();
      return res.json(audits);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const audit = await auditService.getAuditDetails(id);
      if (!audit) return res.status(404).json({ error: 'Not found' });
      return res.json(audit);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
