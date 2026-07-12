const BASE_URL = 'http://localhost:3000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const role = localStorage.getItem('appRole') || 'ADMIN';
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 
      'Content-Type': 'application/json',
      'X-Mock-Role': role
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

// ── Bookings ──────────────────────────────────────────────────────────────

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  assetId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  reason?: string;
  createdAt: string;
  asset?: { id: string; name: string };
}

export const bookingApi = {
  create: (data: { assetId: string; startDate: string; endDate: string; reason: string }) =>
    request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(data) }),

  getForAsset: (assetId: string) =>
    request<Booking[]>(`/bookings/asset/${assetId}`),

  approve: (id: string) =>
    request<Booking>(`/bookings/${id}/approve`, { method: 'POST' }),

  cancel: (id: string) =>
    request<Booking>(`/bookings/${id}/cancel`, { method: 'POST' }),
};

// ── Maintenance ───────────────────────────────────────────────────────────

export type MaintenanceStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

export interface MaintenanceRequest {
  id: string;
  assetId: string;
  requesterId: string;
  technicianId?: string;
  status: MaintenanceStatus;
  issue: string;
  resolution?: string;
  cost?: number;
  createdAt: string;
  resolvedAt?: string;
  asset?: { id: string; name: string };
  requester?: { id: string; name: string };
  technician?: { id: string; name: string };
}

export const maintenanceApi = {
  getAll: () => request<MaintenanceRequest[]>('/maintenance'),

  create: (data: { assetId: string; issue: string }) =>
    request<MaintenanceRequest>('/maintenance', { method: 'POST', body: JSON.stringify(data) }),

  approve: (id: string) =>
    request<MaintenanceRequest>(`/maintenance/${id}/approve`, { method: 'POST' }),

  assign: (id: string, technicianId: string) =>
    request<MaintenanceRequest>(`/maintenance/${id}/assign`, { method: 'POST', body: JSON.stringify({ technicianId }) }),

  resolve: (id: string, resolution: string, cost?: number) =>
    request<MaintenanceRequest>(`/maintenance/${id}/resolve`, { method: 'POST', body: JSON.stringify({ resolution, cost }) }),
};

// ── Audit ─────────────────────────────────────────────────────────────────

export type AuditStatus = 'IN_PROGRESS' | 'CLOSED';

export interface Audit {
  id: string;
  name: string;
  startDate: string;
  status: AuditStatus;
  auditorId: string;
  closedAt?: string;
  auditor?: { id: string; name: string };
  items?: AuditItem[];
  _count?: { items: number };
}

export interface AuditItem {
  id: string;
  auditId: string;
  assetId: string;
  status: 'UNVERIFIED' | 'VERIFIED' | 'DISCREPANCY';
  notes?: string;
  discrepancyType?: 'MISSING' | 'DAMAGED' | 'LOCATION_MISMATCH';
  verifiedAt?: string;
  asset?: { id: string; name: string; serialNumber?: string; location?: string };
}

export const auditApi = {
  getAll: () => request<Audit[]>('/audits'),

  getDetails: (id: string) => request<Audit>(`/audits/${id}`),

  start: (data: { name: string; assetIds: string[] }) =>
    request<Audit>('/audits', { method: 'POST', body: JSON.stringify(data) }),

  close: (id: string) =>
    request<Audit>(`/audits/${id}/close`, { method: 'POST' }),

  verify: (itemId: string, data: { status: 'VERIFIED' | 'DISCREPANCY'; notes?: string; discrepancyType?: string }) =>
    request<AuditItem>(`/audits/items/${itemId}/verify`, { method: 'POST', body: JSON.stringify(data) }),

  getReport: (id: string) => request<AuditItem[]>(`/audits/${id}/report`),
};

// ── Notifications ─────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  assetId?: string;
  action: string;
  description: string;
  createdAt: string;
  user?: { name: string };
  asset?: { name: string };
}

export const notificationApi = {
  getAll: () => request<Notification[]>('/notifications'),

  markRead: (id: string) =>
    request<Notification>(`/notifications/${id}/read`, { method: 'POST' }),

  markAllRead: () =>
    request<{ count: number }>('/notifications/mark-all-read', { method: 'POST' }),

  getLogs: (params?: { assetId?: string; userId?: string }) => {
    const qs = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return request<ActivityLog[]>(`/notifications/logs${qs}`);
  },
};

// ── Assets (read-only from booking/audit forms) ───────────────────────────
export interface Asset {
  id: string;
  name: string;
  serialNumber?: string;
  status: string;
  location?: string;
}

// Direct DB read via maintenance API reuse — we expose assets through a thin fetch
export const assetApi = {
  getAll: () => request<Asset[]>('/assets'),
};
