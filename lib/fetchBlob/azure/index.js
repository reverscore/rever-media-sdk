import axios from 'axios';

import config from '../../config';
import ReverMediaError from '../../ReverMediaError';

export default async function fetchFromAzure(args = {}) {
  const { url } = args;
  const config = buildConfig(args);

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw new ReverMediaError(
      `something happened trying to fetch the image from Azure Storage.\nAzure Storage error: ${err?.message ??
        'No error details.'}`,
    );
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
