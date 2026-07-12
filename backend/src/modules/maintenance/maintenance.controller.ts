import { Request, Response } from 'express';
import { MaintenanceService } from './maintenance.service';

const maintenanceService = new MaintenanceService();

export class MaintenanceController {
  async create(req: Request, res: Response) {
    try {
      const { assetId, issue } = req.body;
      const requesterId = req.user?.id;

      if (!requesterId) return res.status(401).json({ error: 'Unauthorized' });

      const request = await maintenanceService.createRequest({ assetId, requesterId, issue });
      return res.status(201).json(request);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = req.user?.id;

      if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

      const request = await maintenanceService.approveRequest(id, adminId);
      return res.json(request);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async assign(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { technicianId } = req.body;
      const adminId = req.user?.id;

      if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

      const request = await maintenanceService.assignTechnician(id, technicianId, adminId);
      return res.json(request);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async resolve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { resolution, cost } = req.body;
      const technicianId = req.user?.id;

      if (!technicianId) return res.status(401).json({ error: 'Unauthorized' });

      const request = await maintenanceService.resolveRequest(id, technicianId, resolution, cost);
      return res.json(request);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const requests = await maintenanceService.getRequests();
      return res.json(requests);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
