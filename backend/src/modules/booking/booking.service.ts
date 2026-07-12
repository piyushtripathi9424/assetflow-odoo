import prisma from '../../utils/prisma';

export class BookingService {
  /**
   * Create a new booking
   * Business rule: Bookings cannot overlap for the same asset.
   */
  async createBooking(data: { assetId: string; userId: string; startDate: Date; endDate: Date; reason?: string }) {
    const { assetId, userId, startDate, endDate, reason } = data;

    // Check for overlaps
    const overlapping = await prisma.booking.findFirst({
      where: {
        assetId,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlapping) {
      throw new Error('Booking overlaps with an existing schedule for this asset.');
    }

    const booking = await prisma.booking.create({
      data: {
        assetId,
        userId,
        startDate,
        endDate,
        reason,
        status: 'PENDING',
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        userId,
        assetId,
        action: 'BOOKING_CREATED',
        description: `Booking requested from ${startDate.toISOString()} to ${endDate.toISOString()}`,
      },
    });

    return booking;
  }

  async approveBooking(bookingId: string, adminId: string) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'APPROVED' },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: 'Booking Approved',
        message: `Your booking for asset ${booking.assetId} has been approved.`,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: adminId,
        assetId: booking.assetId,
        action: 'BOOKING_APPROVED',
        description: `Booking ${bookingId} approved.`,
      },
    });

    return booking;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        assetId: booking.assetId,
        action: 'BOOKING_CANCELLED',
        description: `Booking ${bookingId} was cancelled.`,
      },
    });

    return booking;
  }

  async getAssetBookings(assetId: string) {
    return prisma.booking.findMany({
      where: { assetId },
      orderBy: { startDate: 'asc' },
    });
  }
}
