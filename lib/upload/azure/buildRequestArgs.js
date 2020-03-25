// These values were taken from the examples in the official Azure Storage REST API docs: https://docs.microsoft.com/en-us/rest/api/storageservices/put-blob
const BLOB_TYPE = 'BlockBlob';
const STORAGE_API_VERSION = '2019-07-07';

export default function buildRequestArgs(args) {
  return {
    endpoint: buildEndpoint(args),
    config: buildConfig(args),
  };
}

function buildEndpoint(args) {
  return `${args?.azureStorageURL}/${args?.fileName}`;
}

function buildConfig(args) {
  return {
    headers: {
      Authorization: `Bearer ${args?.azureStorageToken}`,
      'x-ms-blob-type': BLOB_TYPE,
      'x-ms-version': STORAGE_API_VERSION,
    },
  };
}
