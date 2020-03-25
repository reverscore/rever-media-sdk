import { mockFetch } from 'rn-fetch-blob';

import fetchImageFromAzure from '../../../fetchBase64Image/azure/index.native';

const baseArgs = {
  url: 'https://rever.blob.core.windows.net/rever-useast1-devtest01/my-file.jpg',
  azureStorageToken: 'my azure token',
  mimeType: 'image/jpg',
};

describe('Fetch image from Azure Storage for React Native clients', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the corresponding endpoint using RNFetchBlob', async () => {
    await fetchImageFromAzure(baseArgs);

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
});

/* 
  It('should call the corresponding endpoint using RNFetchBlob', async () => {
    await fetchImageFromRever(baseArgs);

    const actualMethod = mockFetch.mock.calls?.[0]?.[0];
    expect(actualMethod).toBe('GET');

    const actualEndpoint = mockFetch.mock.calls?.[0]?.[1];
    expect(actualEndpoint).toBe(baseArgs.url);

    const actualHeaders = mockFetch.mock.calls?.[0]?.[2];
    expect(actualHeaders).toEqual({
      Authorization: baseArgs.reverToken,
    });
  });

  it('should return the string returned by the "base64" response\'s method', async () => {
    const mockBase64 = 'base 64';
    mockFetch.mockReturnValueOnce(Promise.resolve({ base64: () => mockBase64 }));

    const result = await fetchImageFromRever(baseArgs);

    expect(result).toBe(mockBase64);
  });

  it('should throw an specific error if request is rejected', async () => {
    const errorMessage = 'Server error';
    mockFetch.mockReturnValueOnce(Promise.reject(new Error(errorMessage)));

    await expect(fetchImageFromRever(baseArgs)).rejects.toThrow(
      `an error occurred trying to fetch the image.\nRever API error: ${errorMessage}`,
    );
  });

  it('should throw an specific error if the parsing process fails', async () => {
    const errorMessage = 'Parser exploded';
    mockFetch.mockReturnValueOnce(
      Promise.resolve({
        base64() {
          throw new Error(errorMessage);
        },
      }),
    );

    await expect(fetchImageFromRever(baseArgs)).rejects.toThrow(
      `an error occurred trying to parse the image.\nParsing error: ${errorMessage}`,
    );
  });
});
 */
