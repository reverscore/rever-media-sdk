import ReverMediaError from '../../ReverMediaError';
import uploadForWeb from './web';
import uploadForReactNative from './reactNative';
import createReverMediaObject from './createReverMediaObject';

const REACT_NATIVE_NAVIGATOR_PRODUCT = 'ReactNative';

export default async function uploadToAzure(args = {}) {
  validateArgs(args);

  const upload = getUploaderForCurrentPlatform();
  await upload(args);

  const reverMediaObject = await createReverMediaObject(args);

  return reverMediaObject;
}

function validateArgs(args) {
  const { azureStorageURL, azureStorageToken } = args;

  if (!azureStorageURL) {
    throw new ReverMediaError(
      'the "providers__azure_storage_storageURL" attribute is required in the specified organization in order to upload the file to Azure Storage.',
    );
  }

  if (!azureStorageToken) {
    throw new ReverMediaError('the "azureStorageToken" argument is required.');
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
