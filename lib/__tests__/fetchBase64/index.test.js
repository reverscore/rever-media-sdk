import fetchBase64 from '../../fetchBase64';
import fetchBlob from '../../fetchBlob';

jest.mock('../../fetchBlob');

describe('Fetch Blob as base64 string for Web clients', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error if an invalid size is passed', async () => {
    const args = { reverMediaObject: { id: 'imageid' }, options: { size: 'JUMBO' } };

    await expect(fetchBase64(args)).rejects.toThrow(
      `invalid size specified. Valid sizes are: SQUARE, THUMBNAIL, CARD, WIDE and can be found in the IMAGE_SIZES enum.`,
    );
  });

  it('should call the "fetchBlob" function with the received args', async () => {
    const args = { reverMediaObject: { id: 'imageid' }, options: { size: 'THUMBNAIL' } };
    await fetchBase64(args);

    expect(fetchBlob).toHaveBeenCalledWith(args);
  });

  test('the returned string should start with the proper structure', async () => {
    fetchBlob.mockReturnValueOnce(new Blob());
    const args = { reverMediaObject: { mimeType: 'image/jpg' } };
    const result = await fetchBase64(args);
    const regex = new RegExp(`^(data:${args.reverMediaObject.mimeType};base64,)`);

    expect(result).toEqual(expect.stringMatching(regex));
  });

  it('should return an specific error if a parsing error occurs', async () => {
    const errorMessage = "I don't wanna parse!!";

    jest.spyOn(window, 'btoa').mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(fetchBase64({ reverMediaObject: { mimeType: 'image/jpg' } })).rejects.toThrow(
      `an error occurred trying to parse the fetched BLOB image.\nParsing error: ${errorMessage}`,
    );
  });
});
