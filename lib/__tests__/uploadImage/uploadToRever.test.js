import axios from 'axios';

import uploadToRever from '../../uploadImage/uploadToRever';

jest.mock('axios');

describe('Upload to Rever', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the corresponding Rever API endpoint using the specified Rever token and sending the proper FormData object when a file path is received', async () => {
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    const args = {
      organizationId: 'orgID',
      reverToken: 'tokenrev',
      reverURL: 'https://env-app.reverscore.com/api/v1',
    };

    await uploadToRever(args);

    const actualEndpoint = axios?.post?.mock?.calls?.[0]?.[0];
    const expectedEndpoint = `${args.reverURL}/organizations/${args.organizationId}/media/upload`;
    expect(actualEndpoint).toBe(expectedEndpoint);

    const actualRequestConfig = axios?.post?.mock?.calls?.[0]?.[2];
    const expectedRequestConfig = {
      headers: {
        Authorization: args.reverToken,
      },
    };
    expect(actualRequestConfig).toEqual(expectedRequestConfig);
  });

  it('should send the proper FormData object when a file path is received', async () => {
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    const args = {
      fieldName: 'file',
      filePath: '/Path/to/myFile.jpg',
    };

    await uploadToRever(args);

    const actualFormData = axios?.post?.mock?.calls?.[0]?.[1];
    const expectedData = JSON.stringify({
      fieldName: args.fieldName,
      fileName: args.fileName,
      filePath: args.filePath,
    });
    expect(actualFormData).toBeInstanceOf(FormData);
    expect(actualFormData.get(args.fieldName)).toEqual(expectedData);
  });

  it('should send the proper FormData object when a base64 file is received', async () => {
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    const args = {
      fieldName: 'file',
      file: 'superduperlongbase64',
    };

    await uploadToRever(args);

    const actualFormData = axios?.post?.mock?.calls?.[0]?.[1];

    expect(actualFormData).toBeInstanceOf(FormData);
    expect(actualFormData.get(args.fieldName)).toEqual(args.file);
  });
});
