// Mock data
const mockData = {
  allies: {},
  products: {},
  raffles: {},
};

// Mock Firebase functions
export const ref = jest.fn((db, path) => ({ path }));
export const get = jest.fn(() => ({
  exists: () => Object.keys(mockData).length > 0,
  val: () => mockData,
}));
export const set = jest.fn();
export const update = jest.fn();
export const remove = jest.fn();
export const onValue = jest.fn();
