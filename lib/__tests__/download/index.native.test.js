import download from '../../download/index.native';

jest.mock('react-native-blob-util', () => ({
  config: jest.fn(() => ({
    fetch: jest.fn().mockResolvedValue({
      path: jest
        .fn()
        .mockReturnValue(
          '/data/user/0/com.reverscore.reverdev/files/Screen Shot 2023-10-07 at 12.50.26.png',
        ),
    }),
  })),
}));

describe('download function', () => {
  it('should download a file successfully', async () => {
    const args = {
      reverMediaObject: {
        account: '629fd16967f7c20019df2549',
        bytes: 160870,
        createdAt: '2023-11-02T19:53:46.751Z',
        fileExtension: '.png',
        id: '6543fe4a4becf8b16ecaf9fc',
        isPublic: false,
        mimeType: 'image/png',
        organization: '5c6ec95082876200173513e0',
        originalFileName: 'Screen Shot 2023-10-07 at 12.50.26.png',
        provider: 'AWS_S3',
        resourceType: 'image',
        updatedAt: '2023-11-02T19:53:46.751Z',
        url:
          'https://devtest-api.reverscore.net/api/v1/organizations/5c6ec95082876200173513e0/media/6543fe4a4becf8b16ecaf9fc/download',
      },
      reverToken: 'ab259d94-6102-4a8c-ad08-e2684b9d578d',
    };

    const response = await download(args);

    expect(response).toEqual(
      '/data/user/0/com.reverscore.reverdev/files/Screen Shot 2023-10-07 at 12.50.26.png',
    );
  });
});
