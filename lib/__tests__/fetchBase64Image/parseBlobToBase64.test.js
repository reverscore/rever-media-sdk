import parseBlobToBase64 from '../../fetchBase64Image/parseBlobToBase64';

describe('Parse BLOB to base64 string', () => {
  test('the returned string should start with the proper structure', () => {
    const blob = new Blob();
    const mimeType = 'image/jpg';

    const result = parseBlobToBase64({ blob, mimeType });
    const regex = new RegExp(`^(data:${mimeType};base64,)`);
    expect(result).toEqual(expect.stringMatching(regex));
  });
});
