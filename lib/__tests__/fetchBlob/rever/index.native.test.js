import { mockConfig, mockFetch } from 'react-native-blob-util';

import fetchFromRever from '../../../fetchBlob/rever/index.native';

const baseArgs = {
  url: 'https://env-app.reverscore.com/api/v1/organizations/orgId/media/mediaId/download',
  reverToken: 'my token',
  mimeType: 'image/jpg',
  fileExtension: '.jpg',
};
describe('Fetch Blob from Rever API for React Native clients', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the corresponding endpoint using ReactNativeBlobUtil', async () => {
    await fetchFromRever(baseArgs);

    const actualConfig = mockConfig.mock.calls?.[0]?.[0];
    expect(actualConfig).toEqual({ fileCache: true, appendExt: baseArgs.fileExtension });

    const actualMethod = mockFetch.mock.calls?.[0]?.[0];
    expect(actualMethod).toBe('GET');

    const actualEndpoint = mockFetch.mock.calls?.[0]?.[1];
    expect(actualEndpoint).toBe(baseArgs.url);

    const actualHeaders = mockFetch.mock.calls?.[0]?.[2];
    expect(actualHeaders).toEqual({
      Authorization: baseArgs.reverToken,
    });
  });

  it('should throw an specific error if request is rejected', async () => {
    const errorMessage = 'Server error';
    mockFetch.mockReturnValueOnce(Promise.reject(new Error(errorMessage)));

    await expect(fetchFromRever(baseArgs)).rejects.toThrow(
      `an error occurred trying to fetch the image.\nRever API error: ${errorMessage}`,
    );
  });
});
