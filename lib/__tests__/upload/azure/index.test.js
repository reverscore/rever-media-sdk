import omit from 'lodash/omit';
import axios from 'axios';

import uploadToAzure from '../../../upload/azure';
import uploadForWeb from '../../../upload/azure/upload';
import * as createReverMediaObject from '../../../upload/azure/createReverMediaObject';

jest.mock('axios');
jest.mock('../../../upload/azure/upload');
jest.mock('../../../upload/azure/upload.native');

const baseArgs = {
  azureStorageURL: 'https://rever.blob.core.windows.net/rever-useast1-unstable01',
  azureStorageToken: 'my azure token',
  fileName: 'my-image.jpg',
  fileType: 'image/jpg',
  organizationId: 'myOrg',
  reverToken: 'my rever token',
  reverURL: `https://env-app.reverscore.com/api/v1`,
};

describe('Upload to Azure Storage', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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

  it('should call the corresponding Rever API endpoint with the proper params', async () => {
    uploadForWeb.mockReturnValueOnce(Promise.resolve());
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    await uploadToAzure({ ...baseArgs, isPublic: true });

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
      bytes: 0,
      isPublic: true,
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

  it('should throw a more specific error message if Azure request is rejected with any error', async () => {
    const azureErrorMessage = 'Something happened with Azure Storage API';
    uploadForWeb.mockReturnValueOnce(Promise.reject(new Error(azureErrorMessage)));

    await expect(uploadToAzure(baseArgs)).rejects.toThrow(
      `An error occurred trying to upload your file to Azure Storage.\nAzure error: ${azureErrorMessage}`,
    );
  });

  it('should throw an error if the request is resolved normally but its data is an error string', async () => {
    const azureErrorMessage = 'Error: Unfortunatelly, this is also a posibility :(';

    uploadForWeb.mockReturnValueOnce(
      Promise.resolve('Error: Unfortunatelly, this is also a posibility :('),
    );

    await expect(uploadToAzure(baseArgs)).rejects.toThrow(
      `An error occurred trying to upload your file to Azure Storage.\nAzure error: ${azureErrorMessage}`,
    );
  });

  it('should throw a more specific error message if Rever request is rejected with any error', async () => {
    const reverErrorMessage = 'Something happened with Rever API';
    jest
      .spyOn(createReverMediaObject, 'default')
      .mockReturnValueOnce(Promise.reject(new Error(reverErrorMessage)));

    await expect(uploadToAzure(baseArgs)).rejects.toThrow(
      `An error occurred trying to create a Rever Media Object.\nRever error: ${reverErrorMessage}`,
    );
  });
});
