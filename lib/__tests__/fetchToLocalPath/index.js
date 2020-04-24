import fetchBlob from '../../fetchBlob';
import fetchToLocalPath from '../../fetchToLocalPath';

jest.mock('../../fetchBlob');

describe('Fetch to local path in web browsers', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a blob file and create an object URL using browser APIs', async () => {
    const mockBuffer = 'mybuffer';
    const mockBlob = {};
    const mockObjectURL = 'localurl';
    const args = { reverMediaObject: { mimeType: 'image/jpg' } };

    jest.spyOn(window, 'Blob').mockReturnValueOnce(mockBlob);
    fetchBlob.mockReturnValueOnce(Promise.resolve(mockBuffer));
    window.URL.createObjectURL = jest.fn().mockReturnValueOnce(mockObjectURL);

    const objectURL = await fetchToLocalPath(args);

    expect(objectURL).toBe(mockObjectURL);

    expect(window.Blob.mock.calls[0][0]).toEqual([mockBuffer], {
      type: args.reverMediaObject.mimeType,
    });

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
  });

  it('should return a specific error if any part of the process fails', async () => {
    const errorMessage = 'Fetching failed!';
    fetchBlob.mockReturnValueOnce(Promise.reject(new Error(errorMessage)));

    await expect(fetchToLocalPath()).rejects.toThrow(
      `an error occurred trying to fetch the specified file to a local path.\nError: ${errorMessage}`,
    );
  });
});
