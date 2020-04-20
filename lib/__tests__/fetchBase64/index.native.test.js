import fetchBase64 from '../../fetchBase64/index.native';
import fetchBlob from '../../fetchBlob';

jest.mock('../../fetchBlob');

describe('Fetch Blob as base64 string for React Native clients', () => {
  it('should call the "fetchBlob" function with the received args', async () => {
    const args = { reverMediaObject: {} };
    await fetchBase64(args);

    expect(fetchBlob).toHaveBeenCalledWith(args);
  });

  it('should throw an specific error if the parsing process fails', async () => {
    const errorMessage = 'Parser has COVID';
    fetchBlob.mockReturnValueOnce(
      Promise.resolve({
        base64() {
          throw new Error(errorMessage);
        },
      }),
    );

    await expect(fetchBase64()).rejects.toThrow(
      `an error occurred trying to parse the blob file.\nParsing error: ${errorMessage}`,
    );
  });

  test('the returned string should start with the proper structure', async () => {
    const reverMediaObject = { mimeType: 'image/jpg' };
    const mockBase64 = 'asuperduperlongbase64string';

    fetchBlob.mockReturnValueOnce(
      Promise.resolve({
        base64() {
          return mockBase64;
        },
      }),
    );

    const result = await fetchBase64({ reverMediaObject });
    expect(result).toBe(`data:${reverMediaObject.mimeType};base64,${mockBase64}`);
  });
});
