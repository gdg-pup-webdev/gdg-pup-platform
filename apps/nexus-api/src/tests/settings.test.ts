import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock Auth Middleware
vi.mock('@/middlewares/auth.middleware.js', () => ({
  authMiddlewareInstance: {
    requireAuth: () => (req: any, res: any, next: any) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    },
  },
  AuthMiddleware: class {},
}));

// Mock Service
const mockListSettingsOfUser = vi.fn();
const mockListSettings = vi.fn();
const mockGetOneSettings = vi.fn();
const mockCreateSettings = vi.fn();
const mockUpdateSettings = vi.fn();
const mockDeleteSettings = vi.fn();

vi.mock('../modules/userResourceSystem/settings.service.js', () => ({
  settingsServiceInstance: {
    listSettingsOfUser: (...args: any[]) => mockListSettingsOfUser(...args),
    listSettings: (...args: any[]) => mockListSettings(...args),
    getOneSettings: (...args: any[]) => mockGetOneSettings(...args),
    createSettings: (...args: any[]) => mockCreateSettings(...args),
    updateSettings: (...args: any[]) => mockUpdateSettings(...args),
    deleteSettings: (...args: any[]) => mockDeleteSettings(...args),
  },
  SettingsService: class {},
}));

import app from '../app.js';

describe('Settings API Integration', () => {
  const mockSettings = {
    id: 'set-1',
    user_id: 'test-user-id',
    color_theme: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/user-resource-system/settings - should list settings', async () => {
    mockListSettingsOfUser.mockResolvedValue({
      list: [mockSettings],
      count: 1
    });

    const response = await request(app)
      .get('/api/user-resource-system/settings')
      .query({ userId: 'test-user-id' });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toEqual(mockSettings);
  });

  it('POST /api/user-resource-system/settings - should create settings', async () => {
    mockCreateSettings.mockResolvedValue(mockSettings);

    const newSettings = {
      color_theme: true,
      user_id: 'test-user-id'
    };

    const response = await request(app)
      .post('/api/user-resource-system/settings')
      .send({ data: newSettings });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(mockSettings);
  });

  it('GET /api/user-resource-system/settings/:id - should get one settings', async () => {
    mockGetOneSettings.mockResolvedValue(mockSettings);

    const response = await request(app)
      .get('/api/user-resource-system/settings/set-1');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(mockSettings);
  });

  it('PATCH /api/user-resource-system/settings/:id - should update settings', async () => {
    mockUpdateSettings.mockResolvedValue({ ...mockSettings, color_theme: false });

    const response = await request(app)
      .patch('/api/user-resource-system/settings/set-1')
      .send({ data: { color_theme: false } });

    expect(response.status).toBe(200);
    expect(response.body.data.color_theme).toBe(false);
  });

  it('DELETE /api/user-resource-system/settings/:id - should delete settings', async () => {
    mockDeleteSettings.mockResolvedValue(mockSettings);

    const response = await request(app)
      .delete('/api/user-resource-system/settings/set-1');

    expect(response.status).toBe(200);
    expect(mockDeleteSettings).toHaveBeenCalledWith('set-1');
  });
});
