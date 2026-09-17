import ReverMediaError from '../ReverMediaError';
import {
  buildUnauthorizedError,
  gotUnauthorizedResponse,
  isUnauthorizedError,
} from '../unauthorizedError';

describe('Unauthorized error helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buildUnauthorizedError', () => {
    it('builds a Rever Media Error exposing the axios-compatible unauthorized shape', () => {
      const error = buildUnauthorizedError({ Authorization: 'my token' });

      expect(error).toBeInstanceOf(ReverMediaError);
      expect(error.message).toBe('Unauthorized');
      expect(error.response).toEqual({ status: 401 });
      expect(error.config).toEqual({ headers: { Authorization: 'my token' } });
    });
  });

  describe('isUnauthorizedError', () => {
    it('returns true for axios-like 401 errors', () => {
      const error = new Error('Request failed with status code 401');
      error.response = { status: 401 };

      expect(isUnauthorizedError(error)).toBe(true);
    });

    it('returns true for errors built with buildUnauthorizedError', () => {
      expect(isUnauthorizedError(buildUnauthorizedError())).toBe(true);
    });

    it('returns false for other errors', () => {
      expect(isUnauthorizedError(new Error('boom'))).toBe(false);
    });

    it('returns false when no error is provided', () => {
      expect(isUnauthorizedError(undefined)).toBe(false);
    });
  });

  describe('gotUnauthorizedResponse', () => {
    it('returns true when the response respInfo status is 401', () => {
      expect(gotUnauthorizedResponse({ respInfo: { status: 401 } })).toBe(true);
    });

    it('returns false for other statuses', () => {
      expect(gotUnauthorizedResponse({ respInfo: { status: 200 } })).toBe(false);
    });

    it('returns false when the response has no respInfo', () => {
      expect(gotUnauthorizedResponse(undefined)).toBe(false);
    });
  });
});
