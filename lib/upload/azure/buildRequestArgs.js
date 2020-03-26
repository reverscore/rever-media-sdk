import config from '../../config';

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
      'x-ms-blob-type': config.azureStorage.blobType,
      'x-ms-version': config.azureStorage.apiVersion,
    },
  };
}
