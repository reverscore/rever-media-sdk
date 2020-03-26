import axios from 'axios';

import fetchImageFromAzure from '../../../fetchBase64Image/azure';
import parseBlobToBase64 from '../../../fetchBase64Image/parseBlobToBase64';

jest.mock('axios');
jest.mock('../../../fetchBase64Image/parseBlobToBase64');

const baseArgs = {
  url: 'https://rever.blob.core.windows.net/rever-useast1-devtest01/my-file.jpg',
  azureStorageToken: 'my azure token',
  mimeType: 'image/jpg',
};

describe('Fetch image from Azure for Web clients', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch the image from the proper endpoint, sending the Rever token as header', async () => {
    axios.get.mockReturnValueOnce(Promise.resolve({}));

    await fetchImageFromAzure(baseArgs);

    const actualEndpoint = axios.get.mock.calls?.[0]?.[0];
    expect(actualEndpoint).toBe(baseArgs.url);

    const actualConfig = axios.get.mock.calls?.[0]?.[1];
    expect(actualConfig).toEqual({
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${baseArgs.azureStorageToken}`,
        'x-ms-blob-type': 'BlockBlob',
        'x-ms-version': '2019-07-07',
      },
    });
  });

  it('should throw an specific error if the Azure request is rejected', async () => {
    const errorMessage = "Azure don't want to cooperate.";
    axios.get.mockReturnValueOnce(Promise.reject(new Error(errorMessage)));

    await expect(fetchImageFromAzure(baseArgs)).rejects.toThrow(
      `something happened trying to fetch the image from Azure Storage.\nAzure Storage error: ${errorMessage}`,
    );
  });

  it('should call the BLOB parser utility passing the fetched file and MIME type as arguments', async () => {
    const mockBlob = 'A BLOB file';
    axios.get.mockReturnValueOnce(Promise.resolve({ data: mockBlob }));

    await fetchImageFromAzure(baseArgs);

    const actualArgs = parseBlobToBase64.mock.calls?.[0]?.[0];
    expect(actualArgs).toEqual({
      blob: mockBlob,
      mimeType: baseArgs.mimeType,
    });
  });
});
