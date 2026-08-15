import ReactNativeBlobUtil from 'react-native-blob-util';

import buildRequestArgs from './buildRequestArgs';

const FILE_PATH_PREFIX = 'file://';

export default async function uploadForReactNative(args) {
  const { endpoint, config } = buildRequestArgs(args);
  const filePath = args?.filePath?.replace?.(FILE_PATH_PREFIX, ''); // Not removing the "file://" prefix causes an empty request body on iOS.

  const request = ReactNativeBlobUtil.config(buildBlobUtilConfig(args));

  const response = await request.fetch(
    'PUT',
    endpoint,
    config.headers,
    ReactNativeBlobUtil.wrap(filePath),
  );

  return response?.data;
}

function buildBlobUtilConfig(args) {
  const blobUtilConfig = {};

  if (args?.uploadTimeout) blobUtilConfig.timeout = args.uploadTimeout;

  return blobUtilConfig;
}
