import axios from 'axios';
import fetchFromRever from '../../../fetchBlob/rever';

jest.mock('axios');

const baseArgs = {
  url: 'https://env-app.reverscore.com/api/v1/organizations/orgId/media/mediaId/download',
  reverToken: 'my token',
  mimeType: 'image/jpg',
};

describe('Fetch Blob from Rever API for Web clients', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the image from the proper endpoint, sending the Rever token as header', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({}));

    await fetchFromRever(baseArgs);

    const actualEndpoint = axios.get.mock.calls?.[0]?.[0];
    expect(actualEndpoint).toBe(baseArgs.url);

    const actualConfig = axios.get.mock.calls?.[0]?.[1];
    expect(actualConfig).toEqual({
      responseType: 'arraybuffer',
      headers: {
        Authorization: baseArgs.reverToken,
      },
    });
  });

  it('should throw an specific error if Rever request is rejected', async () => {
    const errorMessage = 'Rever server exploded.';
    axios.get.mockReturnValueOnce(Promise.reject(new Error(errorMessage)));

    await expect(fetchFromRever(baseArgs)).rejects.toThrow(
      `something happened trying to fetch the image from Rever API.\nRever API error: ${errorMessage}`,
    );
  });

  it('should re-throw the original error when the Rever API responds with a 401', async () => {
    const unauthorizedError = new Error('Request failed with status code 401');
    unauthorizedError.response = { status: 401 };
    axios.get.mockReturnValueOnce(Promise.reject(unauthorizedError));

    await expect(fetchFromRever(baseArgs)).rejects.toBe(unauthorizedError);
  });
});
