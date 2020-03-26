import parseBlobToBase64 from '../../fetchAsBase64/parseBlobToBase64';

const baseArgs = {
  blob: new Blob(),
  mimeType: 'image/jpg',
};

describe('Parse BLOB to base64 string', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('the returned string should start with the proper structure', () => {
    const result = parseBlobToBase64(baseArgs);
    const regex = new RegExp(`^(data:${baseArgs.mimeType};base64,)`);
    expect(result).toEqual(expect.stringMatching(regex));
  });

  it('should return an specific error if a parsing error occurs', () => {
    const errorMessage = "I don't wanna parse!!";

    jest.spyOn(window, 'btoa').mockImplementation(() => {
      throw new Error(errorMessage);
    });

    expect(() => parseBlobToBase64(baseArgs)).toThrow(
      `an error occurred trying to parse the fetched BLOB image.\nParsing error: ${errorMessage}`,
    );
  });
});
