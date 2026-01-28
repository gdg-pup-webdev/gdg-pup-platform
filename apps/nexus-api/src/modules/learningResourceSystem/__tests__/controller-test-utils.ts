type CrudMocks = {
  mockList: { mockReset: () => void };
  mockCreate: { mockReset: () => void };
  mockGetOne: { mockReset: () => void };
  mockUpdate: { mockReset: () => void };
  mockDelete: { mockReset: () => void };
};

export const resetCrudMocks = (mocks: CrudMocks) => {
  mocks.mockList.mockReset();
  mocks.mockCreate.mockReset();
  mocks.mockGetOne.mockReset();
  mocks.mockUpdate.mockReset();
  mocks.mockDelete.mockReset();
};
