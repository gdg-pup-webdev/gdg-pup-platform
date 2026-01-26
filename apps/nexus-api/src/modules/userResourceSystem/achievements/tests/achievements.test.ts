/**
 * @file achievements.test.ts
 * @description Integration tests for the Achievements API. 
 * Mocks the authentication middleware and the Achievement service to 
 * verify routing, controller logic, and contract adherence.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';

// Mock Auth Middleware to simulate a logged-in user
vi.mock('@/middlewares/auth.middleware.js', () => ({
  authMiddlewareInstance: {
    requireAuth: () => (req: any, res: any, next: any) => {
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    },
  },
  AuthMiddleware: class {},
}));

// Mock Service methods
const mockListAchievementsOfUser = vi.fn();
const mockListAchievements = vi.fn();
const mockGetOneAchievement = vi.fn();
const mockCreateAchievement = vi.fn();
const mockUpdateAchievement = vi.fn();
const mockDeleteAchievement = vi.fn();

vi.mock('../achievement.service.js', () => ({
  achievementServiceInstance: {
    listAchievementsOfUser: (...args: any[]) => mockListAchievementsOfUser(...args),
    listAchievements: (...args: any[]) => mockListAchievements(...args),
    getOneAchievement: (...args: any[]) => mockGetOneAchievement(...args),
    createAchievement: (...args: any[]) => mockCreateAchievement(...args),
    updateAchievement: (...args: any[]) => mockUpdateAchievement(...args),
    deleteAchievement: (...args: any[]) => mockDeleteAchievement(...args),
  },
  AchievementService: class {},
}));

// Import app AFTER mocks are established
import app from '../../../../app.js';
import { testListResources } from '../../tests/test-helpers.js';

describe('Achievements API Integration', () => {
  const mockAchievement = {
    id: 'ach-1',
    title: 'First Achievement',
    description: 'You did it!',
    user_id: 'test-user-id',
    achieved_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: 'http://example.com/img.png'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/user-resource-system/achievements - should return a list of achievements', async () => {
    await testListResources(
      app,
      '/api/user-resource-system/achievements',
      mockListAchievementsOfUser,
      mockAchievement
    );
  });

  it('POST /api/user-resource-system/achievements - should create an achievement', async () => {
    mockCreateAchievement.mockResolvedValue(mockAchievement);

    const { id, achieved_at, created_at, updated_at, ...newAchievement } = mockAchievement;

    const response = await supertest(app)
      .post('/api/user-resource-system/achievements')
      .send({ data: newAchievement });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(mockAchievement);
  });

  it('GET /api/user-resource-system/achievements/:id - should get one achievement', async () => {
    mockGetOneAchievement.mockResolvedValue(mockAchievement);

    const response = await supertest(app)
      .get('/api/user-resource-system/achievements/ach-1');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(mockAchievement);
  });

  it('PATCH /api/user-resource-system/achievements/:id - should update achievement', async () => {
    mockUpdateAchievement.mockResolvedValue({ ...mockAchievement, title: 'Updated' });

    const response = await supertest(app)
      .patch('/api/user-resource-system/achievements/ach-1')
      .send({ data: { title: 'Updated' } });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated');
  });

  it('DELETE /api/user-resource-system/achievements/:id - should delete achievement', async () => {
    mockDeleteAchievement.mockResolvedValue(mockAchievement);

    const response = await supertest(app)
      .delete('/api/user-resource-system/achievements/ach-1');

    expect(response.status).toBe(200);
    expect(mockDeleteAchievement).toHaveBeenCalledWith('ach-1');
  });
});
