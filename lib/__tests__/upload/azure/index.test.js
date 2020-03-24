import omit from 'lodash/omit';
import axios from 'axios';

import uploadToAzure from '../../../upload/azure';
import uploadForWeb from '../../../upload/azure/web';
import uploadForReactNative from '../../../upload/azure/reactNative';

jest.mock('axios');
jest.mock('../../../upload/azure/web');
jest.mock('../../../upload/azure/reactNative');

const baseArgs = {
  azureStorageURL: 'https://rever.blob.core.windows.net/rever-useast1-unstable01',
  azureStorageToken: 'my azure token',
  fileName: 'my-image.jpg',
  fileType: 'image/jpg',
  organizationId: 'myOrg',
  reverToken: 'my rever token',
  reverURL: `https://env-app.reverscore.com/api/v1`,
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
    jest.clearAllMocks();

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
    const args = omit(baseArgs, 'azureStorageToken');

    await expect(uploadToAzure(args)).rejects.toThrow(
      'the "azureStorageToken" argument is required.',
    );
  });

  it('should call the web uploader if a web environment is detected', async () => {
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
    navigator.product = GOOGLE_CHROME_NAVIGATION_PRODUCT;

    await uploadToAzure(baseArgs);

    expect(uploadForWeb).toHaveBeenCalledWith(baseArgs);
  });

  it('should call the uploader for React Native if that environment is detected', async () => {
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));
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

  it('should call the corresponding Rever API endpoint with the proper params', async () => {
    uploadForWeb.mockReturnValueOnce(Promise.resolve());
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    await uploadToAzure(baseArgs);

    const actualEndpoint = axios.post.mock.calls?.[0]?.[0];
    const expectedEndpoint = `${baseArgs.reverURL}/organizations/${baseArgs.organizationId}/media`;
    expect(actualEndpoint).toBe(expectedEndpoint);

    const actualData = axios.post.mock.calls?.[0]?.[1];
    const expectedData = {
      providerId: 'rever-useast1-unstable01/my-image',
      providerContainerName: 'rever-useast1-unstable01',
      providerURI: `${baseArgs.azureStorageURL}/${baseArgs.fileName}`,
      mimeType: baseArgs.fileType,
      resourceType: 'image',
      originalFileName: baseArgs.fileName,
      fileExtension: '.jpg',
    };
    expect(actualData).toEqual(expectedData);

    const actualRequestConfig = axios.post.mock.calls?.[0]?.[2];
    const expectedRequestConfig = {
      headers: {
        Authorization: baseArgs.reverToken,
      },
    };
    expect(actualRequestConfig).toEqual(expectedRequestConfig);
  });
});
