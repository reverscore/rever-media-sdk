import ReverMediaError from '../../ReverMediaError';
import uploadForWeb from './uploadForWeb';
import uploadForReactNative from './uploadForReactNative';

const REACT_NATIVE_NAVIGATOR_PRODUCT = 'ReactNative';

export default async function uploadToAzure(args = {}) {
  validateArgs(args);

  const uploader = getUploaderForCurrentPlatform();
  await uploader(args);

  return args;
}

function validateArgs(args) {
  const { azureStorageURL, azureToken } = args;

  if (!azureStorageURL) {
    throw new ReverMediaError(
      'the "providers__azure_storage_storageURL" attribute is required in the specified organization in order to upload the file to Azure Storage.',
    );
  }

  if (!azureToken) {
    throw new ReverMediaError('the "azureToken" argument is required.');
  }
}

function getUploaderForCurrentPlatform() {
  if (typeof navigator !== 'undefined' && navigator.product === REACT_NATIVE_NAVIGATOR_PRODUCT) {
    return uploadForReactNative;
  }

  if (typeof document !== 'undefined') {
    return uploadForWeb;
  }

  throw new ReverMediaError(
    'no Azure Storage uploader could be determined for the current platform. Only Web browsers and React Native are supported.',
  );
}
