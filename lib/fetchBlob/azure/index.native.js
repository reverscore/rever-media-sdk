import RNFetchBlob from 'rn-fetch-blob';

import config from '../../config';
import ReverMediaError from '../../ReverMediaError';

export default async function fetchFromAzure(args = {}) {
  const { url } = args;
  const headers = buildHeaders(args);

  try {
    return RNFetchBlob.fetch('GET', url, headers);
  } catch (err) {
    throw new ReverMediaError(
      `an error occurred trying to fetch the image.\nAzure Storage error: ${err?.message ??
        'No error details.'}`,
    );
  }
}

function buildHeaders(args) {
  const { azureStorageToken, mimeType } = args;

  return {
    Authorization: `Bearer ${azureStorageToken}`,
    'Content-type': mimeType,
    'x-ms-blob-type': config.azureStorage.blobType,
    'x-ms-version': config.azureStorage.apiVersion,
  };
}
