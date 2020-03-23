import omit from 'lodash/omit';

import uploadToAzure from '../../../uploadImage/uploadToAzure';
import uploadForWeb from '../../../uploadImage/uploadToAzure/uploadForWeb';
import uploadForReactNative from '../../../uploadImage/uploadToAzure/uploadForReactNative';

jest.mock('../../../uploadImage/uploadToAzure/uploadForWeb');
jest.mock('../../../uploadImage/uploadToAzure/uploadForReactNative');

const baseArgs = {
  azureStorageURL: 'https://rever.blob.core.windows.net/rever-useast1-unstable01',
  azureToken: 'my azure token',
};

const GOOGLE_CHROME_NAVIGATION_PRODUCT = 'Gecko';
const REACT_NATIVE_NAVIGATION_PRODUCT = 'ReactNative';

describe('Upload to Azure Storage', () => {
  let originalNavigatorProduct;
  let originalDocument;

  beforeAll(() => {
    originalNavigatorProduct = navigator.product;
    originalDocument = document;

    Object.defineProperty(navigator, 'product', {
      value: originalNavigatorProduct,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'product', {
      value: originalNavigatorProduct,
      writable: true,
    });

    Object.defineProperty(window, 'document', {
      value: originalDocument,
      writable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(navigator, 'product', {
      value: originalNavigatorProduct,
      writable: false,
    });

    Object.defineProperty(window, 'document', {
      value: originalDocument,
      writable: false,
    });
  });

  it('should throw an error if the Azure Storage URL is not specified', async () => {
    const args = omit(baseArgs, 'azureStorageURL');

    await expect(uploadToAzure(args)).rejects.toThrow(
      'the "providers__azure_storage_storageURL" attribute is required in the specified organization in order to upload the file to Azure Storage.',
    );
  });

  it('should throw an error if the Azure Storage token is not specified', async () => {
    const args = omit(baseArgs, 'azureToken');

    await expect(uploadToAzure(args)).rejects.toThrow('the "azureToken" argument is required.');
  });

  it('should call the web uploader if a web environment is detected', async () => {
    navigator.product = GOOGLE_CHROME_NAVIGATION_PRODUCT;

    await uploadToAzure(baseArgs);

    expect(uploadForWeb).toHaveBeenCalledWith(baseArgs);
  });

  it('should call the uploader for React Native if that environment is detected', async () => {
    navigator.product = REACT_NATIVE_NAVIGATION_PRODUCT;

    await uploadToAzure(baseArgs);

    expect(uploadForReactNative).toHaveBeenCalled();
  });

  it('should throw an error if no uploader can be determined for the current platform', async () => {
    // Implementation detail. Here we're modifiying environment values used to determine the platform where the code is running. Original values are restored in the afterEach block.
    Object.defineProperty(window, 'document', { value: undefined });
    navigator.product = '';

    await expect(uploadToAzure(baseArgs)).rejects.toThrow(
      'no Azure Storage uploader could be determined for the current platform. Only Web browsers and React Native are supported.',
    );
  });
});
