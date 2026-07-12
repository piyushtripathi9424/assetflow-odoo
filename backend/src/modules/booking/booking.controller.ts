import { Request, Response } from 'express';
import { BookingService } from './booking.service';

const bookingService = new BookingService();

export class BookingController {
  async create(req: Request, res: Response) {
    try {
      const { assetId, startDate, endDate, reason } = req.body;
      const userId = req.user?.id; // Assuming auth middleware sets req.user

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const booking = await bookingService.createBooking({
        assetId,
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      });

      return res.status(201).json(booking);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = req.user?.id;

      if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

      const booking = await bookingService.approveBooking(id, adminId);
      return res.json(booking);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const booking = await bookingService.cancelBooking(id, userId);
      return res.json(booking);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getForAsset(req: Request, res: Response) {
    try {
      const { assetId } = req.params;
      const bookings = await bookingService.getAssetBookings(assetId);
      return res.json(bookings);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
