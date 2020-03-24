import axios from 'axios';
import uploadForWeb from '../../../upload/azure/web';

jest.mock('axios');

const baseArgs = {
  azureStorageURL: 'https://rever.blob.core.windows.net/rever-useast1-devtest01',
  azureStorageToken: 'my azure storage token',
  file: 'my blob file',
  fileName: 'my-file.jpg',
};

describe('Upload to Azure Storage from Web browser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the corresponding Azure Storage API endpoint passing the expected data, headers and payload', async () => {
    axios.put.mockReturnValueOnce(Promise.resolve({ data: {} }));

    await uploadForWeb(baseArgs);

    const actualEndpoint = axios.put.mock?.calls?.[0]?.[0];
    const expectedEndpoint = `${baseArgs.azureStorageURL}/${baseArgs.fileName}`;

    expect(actualEndpoint).toBe(expectedEndpoint);

    const actualPayload = axios.put.mock?.calls?.[0]?.[1];
    expect(actualPayload).toBe(baseArgs.file);

    const actualRequestConfig = axios.put.mock?.calls?.[0]?.[2];
    const expectedRequestConfig = {
      headers: {
        Authorization: `Bearer ${baseArgs.azureStorageToken}`,
        'x-ms-blob-type': 'BlockBlob',
        'x-ms-version': '2019-07-07',
      },
    };

    expect(actualRequestConfig).toEqual(expectedRequestConfig);
  });
});
