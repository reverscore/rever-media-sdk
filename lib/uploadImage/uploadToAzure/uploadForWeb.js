import axios from 'axios';

import ReverMediaError from '../../ReverMediaError';

// These values were taken from the examples in the official Azure Storage REST API docs: https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
const BLOB_TYPE = 'BlockBlob';
const STORAGE_API_VERSION = '2019-07-07';

export default async function uploadForWeb(args = {}) {
  const endpoint = buildEndpoint(args);
  const payload = args.file;
  const config = buildRequestConfig(args);

  try {
    const response = await axios.put(endpoint, payload, config);
    const data = response?.data;

    if (isErrorResponse(data)) return handleErrorResponse(data);
    return response.data;
  } catch (err) {
    handleErrorResponse(err?.message);
  }
}

function buildEndpoint(args) {
  return `${args?.azureStorageURL}/${args?.fileName}`;
}

function buildRequestConfig(args) {
  return {
    headers: {
      Authorization: `Bearer ${args?.azureStorageToken}`,
      'x-ms-blob-type': BLOB_TYPE,
      'x-ms-version': STORAGE_API_VERSION,
    },
  };
}

function handleErrorResponse(errorMessage = 'No error details.') {
  throw new ReverMediaError(
    `An error occurred trying to upload your file to Azure Storage.\nAzure error: ${errorMessage}`,
  );
}

// In some tests the Azure Storage request was resolved successfully but its data attribute was a string containing the actual error. That's why we should cover that case with this regex.
function isErrorResponse(response) {
  return /error/i.test(response);
}
