import RNFetchBlob from 'rn-fetch-blob';

import ReverMediaError from '../../ReverMediaError';

export default async function fetchFromRever(args) {
  const { url } = args;
  const headers = buildHeaders(args);

  try {
    return RNFetchBlob.fetch('GET', url, headers);
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
