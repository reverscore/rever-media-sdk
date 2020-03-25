import RNFetchBlob from 'rn-fetch-blob';

import config from '../../config';

export default async function fetchFromAzure(args = {}) {
  const { url } = args;
  const headers = buildHeaders(args);

  await RNFetchBlob.fetch('GET', url, headers);
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
