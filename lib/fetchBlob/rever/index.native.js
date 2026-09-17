import ReactNativeBlobUtil from 'react-native-blob-util';

import ReverMediaError from '../../ReverMediaError';
import { buildUnauthorizedError, gotUnauthorizedResponse } from '../../unauthorizedError';

export default async function fetchFromRever(args) {
  const { url, fileExtension } = args;
  const headers = buildHeaders(args);

  let response;
  try {
    response = await ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: fileExtension,
    }).fetch('GET', url, headers);
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to fetch the image.\nRever API error: ${err?.message ??
        'No error details.'}`,
    );
  }

  // React-native-blob-util resolves the fetch promise regardless of the HTTP
  // status, so an expired session that answers 401 must be detected here.
  if (gotUnauthorizedResponse(response)) throw buildUnauthorizedError(headers);

  return response;
}

function buildHeaders(args) {
  return {
    Authorization: args.reverToken,
  };
}
