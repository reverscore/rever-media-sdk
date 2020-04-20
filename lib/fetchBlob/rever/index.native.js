import RNFetchBlob from 'rn-fetch-blob';

import ReverMediaError from '../../ReverMediaError';

export default async function fetchFromRever(args) {
  const { url, fileExtension } = args;
  const headers = buildHeaders(args);

  try {
    const response = await RNFetchBlob.config({ fileCache: true, appendExt: fileExtension }).fetch(
      'GET',
      url,
      headers,
    );
    return response;
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to fetch the image.\nRever API error: ${err?.message ??
        'No error details.'}`,
    );
  }
}

function buildHeaders(args) {
  return {
    Authorization: args.reverToken,
  };
}
