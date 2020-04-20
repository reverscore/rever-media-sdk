export const mockFetch = jest.fn(() => Promise.resolve());
export const mockWrap = jest.fn(str => `Wrapped(${str})`);
export const mockDispose = jest.fn(() => Promise.resolve());
export const mockSession = jest.fn(() => ({
  dispose: mockDispose,
}));

export default {
  fetch: mockFetch,
  wrap: mockWrap,
  session: mockSession,
};
