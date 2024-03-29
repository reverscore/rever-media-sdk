import { mockFetch } from 'react-native-blob-util';

import uploadForReactNative from '../../../upload/azure/upload.native';

const baseArgs = {
  azureStorageURL: 'https://rever.blob.core.windows.net/rever-useast1-devtest01',
  azureStorageToken: 'my azure storage token',
  filePath: 'file:///User/Folder/file.jpg',
  fileName: 'file.jpg',
  fileType: 'image/jpg',
};

describe('Upload to Azure from React Native clients', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send the blob file to Azure using ReactNativeBlobUtil using the proper endpoint, headers and payload', async () => {
    mockFetch.mockReturnValueOnce(Promise.resolve({ data: {} }));
    await uploadForReactNative(baseArgs);

    const actualHTTPMethod = mockFetch.mock.calls?.[0]?.[0];
    expect(actualHTTPMethod).toBe('PUT');

    const actualEndpoint = mockFetch.mock.calls?.[0]?.[1];
    expect(actualEndpoint).toBe(`${baseArgs.azureStorageURL}/${baseArgs.fileName}`);

    const actualConfig = mockFetch.mock.calls?.[0]?.[2];
    expect(actualConfig).toEqual({
      Authorization: `Bearer ${baseArgs.azureStorageToken}`,
      'Cache-Control': 'max-age=31536000000, must-revalidate',
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': '2019-07-07',
    });

    const actualPath = mockFetch.mock.calls?.[0]?.[3];
    expect(actualPath).toBe(`Wrapped(/User/Folder/file.jpg)`); // File path without "file:// prefix"
  });
});
