export type TestFile = {
  id: string;
  user_id: string | null;
  name: string;
  created_at: string;
};

export const createTestFile = (overrides: Partial<TestFile> = {}): TestFile => ({
  id: "file-1",
  user_id: "user-1",
  name: "Sample File",
  created_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

export const createListResult = (files: TestFile[]) => ({
  list: files,
  count: files.length,
});
