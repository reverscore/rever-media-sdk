import fetchToLocalPath from '../../fetchToLocalPath/index.native';
import fetchBlob from '../../fetchBlob';

jest.mock('../../fetchBlob');

describe('Fetch blob to local path for React Native clients', () => {
  it('should call the fetchBlob method with the received args', async () => {
    const args = { reverMediaObject: {} };

    await fetchToLocalPath(args);

    expect(fetchBlob).toHaveBeenCalledWith(args);
  });

  it('should return the same value as the "path" method of ReactNativeBlobUtil response', async () => {
    const mockPath = '/User/folder/myPath/file';

    fetchBlob.mockReturnValueOnce({
      path() {
        return mockPath;
      },
    });

    const result = await fetchToLocalPath();

    expect(result).toBe(mockPath);
  });

  it('should return an specific error when something happens trying to get the local path where the file was stored', async () => {
    const errorMessage = 'the path does not exist!';

    fetchBlob.mockReturnValueOnce({
      path() {
        throw new Error(errorMessage);
      },
    });

    await expect(fetchToLocalPath()).rejects.toThrow(
      `an error occurred trying to get the local path where the file was stored.\nError: ${errorMessage}`,
    );
  });

  it('should re-throw unauthorized errors as-is instead of wrapping them', async () => {
    const unauthorizedError = new Error('Unauthorized');
    unauthorizedError.response = { status: 401 };

    fetchBlob.mockReturnValueOnce(Promise.reject(unauthorizedError));

    await expect(fetchToLocalPath({ reverMediaObject: {} })).rejects.toBe(unauthorizedError);
  });
});
