import RNFetchBlob from 'rn-fetch-blob';

import buildRequestArgs from './buildRequestArgs';

export default async function uploadForReactNative(args) {
  const { endpoint, config } = buildRequestArgs(args);

  const response = await RNFetchBlob.fetch(
    'PUT',
    endpoint,
    config.headers,
    RNFetchBlob.wrap(args.filePath),
  );

  return response?.data;
}
