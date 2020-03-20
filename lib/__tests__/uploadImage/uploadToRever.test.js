import axios from 'axios';

import uploadToRever from '../../uploadImage/uploadToRever';

jest.mock('axios');

describe('Upload to Rever', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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

  it.only('should send the proper FormData object when a file path is received', async () => {
    const mockFormDataAppend = jest.fn();

    class MockFormData {
      append(args) {
        mockFormDataAppend(args);
      }
    }

    jest.mock('FormData', MockFormData);

    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    const args = {
      filePath: '/Path/to/myFile.jpg',
      fileType: 'image/jpg',
    };

    await uploadToRever(args);

    const actualFormData = mockFormDataAppend.mock?.calls?.[0]?.[1];
    const expectedData = {
      name: 'myFile.jpg',
      uri: args.filePath,
      type: args.fileType,
    };
    expect(actualFormData).toBeInstanceOf(MockFormData);
    expect(actualFormData).toEqual(expectedData);
  });

  it('should send the proper FormData object when a blob file is received', async () => {
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    const file = new Blob();
    const args = { fieldName: 'file', file, fileName: 'some-name.jpg' };

    await uploadToRever(args);

    const actualFormData = axios?.post?.mock?.calls?.[0]?.[1];
    expect(actualFormData).toBeInstanceOf(FormData);

    const actualFile = actualFormData.get(args.fieldName);
    expect(actualFile.name).toBe(args.fileName);
  });
});
