export const mockFetch = jest.fn(() => Promise.resolve());
export const mockWrap = jest.fn(str => `Wrapped(${str})`);

export default {
  fetch: mockFetch,
  wrap: mockWrap,
};
