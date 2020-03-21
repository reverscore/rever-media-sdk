import axios from 'axios';

import uploadToRever from '../../uploadImage/uploadToRever';
import * as getReverRequestPayload from '../../uploadImage/getReverRequestPayload';

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

  it('should send the proper FormData object when a blob file is received', async () => {
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    const args = { file: new Blob(), fileName: 'some-name.jpg' };

    await uploadToRever(args);

    const actualFormData = axios?.post?.mock?.calls?.[0]?.[1];
    expect(actualFormData).toBeInstanceOf(FormData);

    const actualFile = actualFormData.get('file');
    expect(actualFile.name).toBe(args.fileName);
  });

  it('should call the payload generator utility when a file path is received', async () => {
    // I tried to make a more integral test like my previous one but when the "formData.append" method is called with an object and then that value is getted using the "formData.get" method what you get is a string like "[object Object]". That's why the "getReverRequestPayload" method was extracted and tested individually. In this test we're only testing the util is actually being called.
    jest.spyOn(getReverRequestPayload, 'default').mockReturnValueOnce({});
    axios.post.mockReturnValueOnce(Promise.resolve({ data: {} }));

    const args = {
      filePath: '/Path/to/myFile.jpg',
      fileType: 'image/jpg',
    };

    await uploadToRever(args);

    const actualFormData = axios?.post?.mock?.calls?.[0]?.[1];
    expect(actualFormData).toBeInstanceOf(FormData);

    expect(getReverRequestPayload.default).toHaveBeenCalledWith(args);
  });
});
