import download from '../../download/index.native';

describe('Download Blob file for React Native clients', () => {
  it('should throw an error since this functionality is not supported yet', async () => {
    await expect(download()).rejects.toThrow(
      'currently, the download functionality is not available for React Native clients.',
    );
  });
});
