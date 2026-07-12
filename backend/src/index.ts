import express from 'express';
import cors from 'cors';
import bookingRoutes from './modules/booking/booking.routes';
import maintenanceRoutes from './modules/maintenance/maintenance.routes';
import auditRoutes from './modules/audit/audit.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import assetRoutes from './modules/assets/assets.routes';
import { mockAuth } from './middleware/auth';

const app = express();
const PORT = 3000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(mockAuth); // Inject mock admin user on every request

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/assets', assetRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'AssetFlow API is running', timestamp: new Date() });
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  AssetFlow API running at http://localhost:${PORT}`);
  console.log(`📋  Health check: http://localhost:${PORT}/health`);
  console.log(`\n  Routes:`);
  console.log(`    POST   /api/bookings`);
  console.log(`    GET    /api/bookings/asset/:assetId`);
  console.log(`    POST   /api/bookings/:id/approve`);
  console.log(`    POST   /api/bookings/:id/cancel`);
  console.log(`    GET    /api/maintenance`);
  console.log(`    POST   /api/maintenance`);
  console.log(`    POST   /api/maintenance/:id/approve`);
  console.log(`    POST   /api/maintenance/:id/assign`);
  console.log(`    POST   /api/maintenance/:id/resolve`);
  console.log(`    GET    /api/audits`);
  console.log(`    POST   /api/audits`);
  console.log(`    GET    /api/audits/:id`);
  console.log(`    POST   /api/audits/:id/close`);
  console.log(`    GET    /api/audits/:id/report`);
  console.log(`    POST   /api/audits/items/:itemId/verify`);
  console.log(`    GET    /api/notifications`);
  console.log(`    GET    /api/notifications/logs`);
});

export default app;
