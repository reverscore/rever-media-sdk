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
      'Cache-Control': `max-age=${config.azureStorage.cacheTTL}, must-revalidate`, // Refer to https://alexandrebrisebois.wordpress.com/2013/08/11/save-money-by-setting-cache-control-on-windows-azure-blobs/ for more information. Once the image is uploaded it does not change, so we're sending a cache TTL of one year.
    },
  };
}
