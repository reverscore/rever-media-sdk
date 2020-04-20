import fetchToLocalPath from '../../fetchToLocalPath';

describe('Fetch to local path in web browsers', () => {
  it('should throw an error', async () => {
    await expect(fetchToLocalPath()).rejects.toThrow(
      'blob files caching is not supported for Web clients yet.',
    );
  });
});
