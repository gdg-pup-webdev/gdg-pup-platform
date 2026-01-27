/**
 * @file certificates.test.ts
 * @description Integration tests for the Certificates API.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';

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

// Mock Service methods
const mockListCertificatesOfUser = vi.fn();
const mockListCertificates = vi.fn();
const mockGetOneCertificate = vi.fn();
const mockCreateCertificate = vi.fn();
const mockUpdateCertificate = vi.fn();
const mockDeleteCertificate = vi.fn();

vi.mock('../certificate.service.js', () => ({
  certificateServiceInstance: {
    listCertificatesOfUser: (...args: any[]) => mockListCertificatesOfUser(...args),
    listCertificates: (...args: any[]) => mockListCertificates(...args),
    getOneCertificate: (...args: any[]) => mockGetOneCertificate(...args),
    createCertificate: (...args: any[]) => mockCreateCertificate(...args),
    updateCertificate: (...args: any[]) => mockUpdateCertificate(...args),
    deleteCertificate: (...args: any[]) => mockDeleteCertificate(...args),
  },
  CertificateService: class {},
}));

import app from '../../../../app.js';
import { testListResources } from '../../__tests__/test-helpers.js';

describe('Certificates API Integration', () => {
  const mockCertificate = {
    id: 'cert-1',
    title: 'Certified Developer',
    description: 'Passed the exam',
    user_id: 'test-user-id',
    image_url: 'http://example.com/cert.png'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/user-resource-system/certificates - should list certificates', async () => {
    await testListResources(
      app,
      '/api/user-resource-system/certificates',
      mockListCertificatesOfUser,
      mockCertificate
    );
  });

  it('POST /api/user-resource-system/certificates - should create certificate', async () => {
    mockCreateCertificate.mockResolvedValue(mockCertificate);

    const { id, ...newCertificate } = mockCertificate;

    const response = await supertest(app)
      .post('/api/user-resource-system/certificates')
      .send({ data: newCertificate });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(mockCertificate);
  });

  it('GET /api/user-resource-system/certificates/:id - should get one certificate', async () => {
    mockGetOneCertificate.mockResolvedValue(mockCertificate);

    const response = await supertest(app)
      .get('/api/user-resource-system/certificates/cert-1');

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(mockCertificate);
  });

  it('PATCH /api/user-resource-system/certificates/:id - should update certificate', async () => {
    mockUpdateCertificate.mockResolvedValue({ ...mockCertificate, title: 'Updated' });

    const response = await supertest(app)
      .patch('/api/user-resource-system/certificates/cert-1')
      .send({ data: { title: 'Updated' } });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated');
  });

  it('DELETE /api/user-resource-system/certificates/:id - should delete certificate', async () => {
    mockDeleteCertificate.mockResolvedValue(mockCertificate);

    const response = await supertest(app)
      .delete('/api/user-resource-system/certificates/cert-1');

    expect(response.status).toBe(200);
    expect(mockDeleteCertificate).toHaveBeenCalledWith('cert-1');
  });
});
