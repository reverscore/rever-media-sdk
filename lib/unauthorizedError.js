import ReverMediaError from './ReverMediaError';

const UNAUTHORIZED_STATUS_CODE = 401;

/**
 * Builds a Rever Media Error that exposes the axios-compatible unauthorized
 * shape consumed by apps to trigger session recovery flows:
 *   - error.response.status === 401
 *   - error.config.headers.Authorization (the token that was sent)
 * @param {Object} headers headers sent with the original request.
 */
export function buildUnauthorizedError(headers = {}) {
  const error = new ReverMediaError('Unauthorized');
  error.response = { status: UNAUTHORIZED_STATUS_CODE };
  error.config = { headers };
  return error;
}

export function isUnauthorizedError(error) {
  return error?.response?.status === UNAUTHORIZED_STATUS_CODE;
}

/**
 * React-native-blob-util resolves its fetch promise regardless of the HTTP
 * status, so unauthorized responses must be detected by inspecting respInfo.
 * @param {Object} response the resolved react-native-blob-util response.
 */
export function gotUnauthorizedResponse(response) {
  return response?.respInfo?.status === UNAUTHORIZED_STATUS_CODE;
}
