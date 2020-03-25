import RNFetchBlob from 'rn-fetch-blob';

import config from '../../config';
import ReverMediaError from '../../ReverMediaError';

export default async function fetchFromAzure(args = {}) {
  const { url } = args;
  const headers = buildHeaders(args);

  const response = await RNFetchBlob.fetch('GET', url, headers).catch(handleFetchResponse);

  try {
    const base64 = response?.base64?.();
    return base64;
  } catch (err) {
    handleParsingError(err);
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

function handleFetchResponse(err) {
  throw new ReverMediaError(
    `an error occurred trying to fetch the image.\nAzure Storage error: ${err?.message ??
      'No details.'}`,
  );
}

function handleParsingError(err) {
  throw new ReverMediaError(
    `an error occurred trying to parse the image.\nParsing error: ${err?.message ?? 'No details.'}`,
  );
}
