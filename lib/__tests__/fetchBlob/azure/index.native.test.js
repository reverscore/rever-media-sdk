import { mockConfig, mockFetch } from 'react-native-blob-util';

import fetchFromAzure from '../../../fetchBlob/azure/index.native';

const baseArgs = {
  url: 'https://rever.blob.core.windows.net/rever-useast1-devtest01/my-file.jpg',
  azureStorageToken: 'my azure token',
  mimeType: 'image/jpg',
  fileExtension: '.jpg',
};

describe('Fetch Blob from Azure Storage for React Native clients', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the corresponding endpoint using ReactNativeBlobUtil', async () => {
    await fetchFromAzure(baseArgs);

    const actualConfig = mockConfig.mock.calls?.[0]?.[0];
    expect(actualConfig).toEqual({
      fileCache: true,
      appendExt: baseArgs.fileExtension,
    });

    const actualMethod = mockFetch.mock.calls?.[0]?.[0];
    expect(actualMethod).toBe('GET');

    const actualEndpoint = mockFetch.mock.calls?.[0]?.[1];
    expect(actualEndpoint).toBe(baseArgs.url);

    const actualHeaders = mockFetch.mock.calls?.[0]?.[2];
    expect(actualHeaders).toEqual({
      Authorization: `Bearer ${baseArgs.azureStorageToken}`,
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': '2019-07-07',
      'Content-type': baseArgs.mimeType,
    });
  });

  it('should throw an specific error if request is rejected', async () => {
    const errorMessage = 'Server is sick';
    mockFetch.mockReturnValueOnce(Promise.reject(new Error(errorMessage)));

    await expect(fetchFromAzure(baseArgs)).rejects.toThrow(
      `an error occurred trying to fetch the image.\nAzure Storage error: ${errorMessage}`,
    );
  });
});
