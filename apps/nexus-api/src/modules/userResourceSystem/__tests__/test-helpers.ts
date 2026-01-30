import { expect } from 'vitest';
import supertest from 'supertest';
import { Express } from 'express';

export const testListResources = async (
  app: Express,
  endpoint: string,
  mockListFn: any,
  mockData: any
) => {
  mockListFn.mockResolvedValue({ list: [mockData], count: 1 });

  const response = await supertest(app)
    .get(endpoint)
    .query({ userId: 'test-user-id', pageNumber: 1, pageSize: 10 });

  expect(response.status).toBe(200);
  expect(response.body.status).toBe('success');
  expect(response.body.data).toHaveLength(1);
  expect(response.body.data[0]).toEqual(mockData);
};
