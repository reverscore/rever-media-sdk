import RNFetchBlob from 'rn-fetch-blob';

import buildRequestArgs from './buildRequestArgs';

const FILE_PATH_PREFIX = 'file://';

export default async function uploadForReactNative(args) {
  const { endpoint, config } = buildRequestArgs(args);

  const response = await RNFetchBlob.fetch(
    'PUT',
    endpoint,
    config.headers,
    RNFetchBlob.wrap(args?.filePath?.replace?.(FILE_PATH_PREFIX, '')), // Not removing the "file://"" prefix causes an empty request body on iOS.
  );

  return response?.data;
}
