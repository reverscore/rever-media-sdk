import ReactNativeBlobUtil from 'react-native-blob-util';

import buildRequestArgs from './buildRequestArgs';

const FILE_PATH_PREFIX = 'file://';

export default async function uploadForReactNative(args) {
  const { endpoint, config } = buildRequestArgs(args);

  const response = await ReactNativeBlobUtil.fetch(
    'PUT',
    endpoint,
    config.headers,
    ReactNativeBlobUtil.wrap(args?.filePath?.replace?.(FILE_PATH_PREFIX, '')), // Not removing the "file://"" prefix causes an empty request body on iOS.
  );

  return response?.data;
}
