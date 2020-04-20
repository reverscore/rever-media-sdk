export const mockFetch = jest.fn(() => Promise.resolve());
export const mockWrap = jest.fn(str => `Wrapped(${str})`);
export const mockDispose = jest.fn(() => Promise.resolve());
export const mockSession = jest.fn(() => ({
  dispose: mockDispose,
}));
export const mockConfig = jest.fn(() => ({
  fetch: mockFetch,
}));

export default {
  fetch: mockFetch,
  wrap: mockWrap,
  session: mockSession,
  config: mockConfig,
};
