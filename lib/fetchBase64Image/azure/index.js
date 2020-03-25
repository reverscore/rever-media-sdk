import axios from 'axios';

import ReverMediaError from '../../ReverMediaError';
import parseBlobToBase64 from '../parseBlobToBase64';

const RESPONSE_TYPE = 'arraybuffer';
const BLOB_TYPE = 'BlockBlob';
const STORAGE_API_VERSION = '2019-07-07';

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
    responseType: RESPONSE_TYPE,
    headers: {
      Authorization: `Bearer ${azureStorageToken}`,
      'x-ms-blob-type': BLOB_TYPE,
      'x-ms-version': STORAGE_API_VERSION,
    },
  };
}

function handleFetchError(err) {
  throw new ReverMediaError(
    `something happened trying to fetch the image from Azure Storage.\nAzure Storage error: ${err.message}`,
  );
}
