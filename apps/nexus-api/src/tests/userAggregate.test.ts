/**
 * @file userAggregate.test.ts
 * @description Integration tests for the User System Aggregate endpoint.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock User Service
const mockGetUserAggregate = vi.fn();

vi.mock('../modules/userSystem/user.service.js', () => ({
  userServiceInstance: {
    getUserAggregate: (...args: any[]) => mockGetUserAggregate(...args),
  },
  UserService: class {},
}));

import app from '../app.js';

describe('User Aggregate API Integration', () => {
  const now = new Date().toISOString();
  
  const mockAggregateData = {
    id: 'user-1',
    email: 'user@example.com',
    display_name: 'Test User',
    avatar_url: 'http://example.com/avatar.png',
    created_at: now,
    updated_at: now,
    first_name: 'Test',
    last_name: 'User',
    gdg_id: 'gdg-1',
    status: 'active',
    wallet: [{ 
      id: 'w1', 
      balance: 100, 
      user_id: 'user-1', 
      created_at: now, 
      updated_at: now 
    }],
    user_profile: [{ 
      id: 'p1', 
      bio: 'Hello', 
      user_id: 'user-1', 
      created_at: now, 
      updated_at: now,
      github_url: 'http://github.com',
      linkedin_url: 'http://linkedin.com',
      portfolio_url: 'http://portfolio.com',
      program: 'CS',
      year_level: 4,
      is_public: true,
      skills_summary: 'coding'
    }],
    user_project: [{ 
      id: 'proj1', 
      title: 'GDG Platform', 
      description: 'Cool project',
      user_id: 'user-1', 
      created_at: now,
      repo_url: 'http://repo.com',
      demo_url: 'http://demo.com',
      tech_stack: 'TS'
    }],
    user_achievement: [{ 
      id: 'ach1', 
      title: 'Winner', 
      description: 'First place',
      image_url: 'http://img.com',
      user_id: 'user-1', 
      achieved_at: now,
      created_at: now,
      updated_at: now
    }],
    user_certificate: [{ 
      id: 'cert1', 
      title: 'Certified', 
      description: 'Passed',
      image_url: 'http://cert.com',
      user_id: 'user-1' 
    }],
    user_settings: [{ 
      id: 'set1', 
      user_id: 'user-1',
      color_theme: true 
    }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/user-system/users/:userId/aggregate - should return comprehensive user data', async () => {
    mockGetUserAggregate.mockResolvedValue(mockAggregateData);

    const response = await request(app)
      .get('/api/user-system/users/user-1/aggregate');

    if (response.status !== 200) {
      console.error('Validation Errors:', response.body.errors);
    }

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    
    const data = response.body.data;
    
    expect(data.id).toBe('user-1');
    expect(data.wallets).toHaveLength(1);
    expect(data.achievements).toHaveLength(1);
    expect(data.certificates).toHaveLength(1);
    expect(data.settings).toHaveLength(1);
  });
});