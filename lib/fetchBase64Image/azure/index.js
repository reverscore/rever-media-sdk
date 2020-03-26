import axios from 'axios';

import config from '../../config';
import ReverMediaError from '../../ReverMediaError';
import parseBlobToBase64 from '../parseBlobToBase64';

export default async function fetchFromAzure(args = {}) {
  const { url, mimeType } = args;
  const config = buildConfig(args);

  try {
    const response = await axios.get(url, config);
    return parseBlobToBase64({
      blob: response?.data,
      mimeType,
    });
  } catch (err) {
    return handleFetchError(err);
  }
}

function buildConfig(args) {
  const { azureStorageToken } = args;

  return {
    responseType: config.azureStorage.responseType,
    headers: {
      Authorization: `Bearer ${azureStorageToken}`,
      'x-ms-blob-type': config.azureStorage.blobType,
      'x-ms-version': config.azureStorage.apiVersion,
    },
  };
}

function handleFetchError(err) {
  throw new ReverMediaError(
    `something happened trying to fetch the image from Azure Storage.\nAzure Storage error: ${err.message}`,
  );
}
