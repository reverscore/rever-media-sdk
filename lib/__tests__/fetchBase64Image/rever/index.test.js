import axios from 'axios';
import fetchImageFromRever from '../../../fetchBase64Image/rever';
import parseBlobToBase64 from '../../../fetchBase64Image/parseBlobToBase64';

jest.mock('axios');
jest.mock('../../../fetchBase64Image/parseBlobToBase64');

const baseArgs = {
  url: 'https://env-app.reverscore.com/api/v1/organizations/orgId/media/mediaId/download',
  reverToken: 'my token',
  mimeType: 'image/jpg',
};

describe('Fetch image from Rever API for Web clients', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the image from the proper endpoint, sending the Rever token as header', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({}));

    await fetchImageFromRever(baseArgs);

    const actualEndpoint = axios.get.mock.calls?.[0]?.[0];
    expect(actualEndpoint).toBe(baseArgs.url);

    const actualConfig = axios.get.mock.calls?.[0]?.[1];
    expect(actualConfig).toEqual({
      headers: {
        Authorization: baseArgs.reverToken,
      },
    });
  });

  it('should throw an specific error if Rever request is rejected', async () => {
    const errorMessage = 'Rever server exploded.';
    axios.get.mockReturnValueOnce(Promise.reject(new Error(errorMessage)));

    await expect(fetchImageFromRever(baseArgs)).rejects.toThrow(
      `something happened trying to fetch the image from Rever API.\nRever API error: ${errorMessage}`,
    );
  });

  it('should call the BLOB parser utility passing the fetched file and MIME type as arguments', async () => {
    const mockBlob = 'A BLOB file';
    axios.get.mockReturnValueOnce(Promise.resolve({ data: mockBlob }));

    await fetchImageFromRever(baseArgs);

    const actualArgs = parseBlobToBase64.mock.calls?.[0]?.[0];
    expect(actualArgs).toEqual({
      blob: mockBlob,
      mimeType: baseArgs.mimeType,
    });
  });
});
