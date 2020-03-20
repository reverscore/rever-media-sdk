import getReverRequestPayload from '../../uploadImage/getReverRequestPayload';

describe('Get Rever upload request payload', () => {
  it('should return the "file" arg if it\'s received', () => {
    const args = {
      file: 'blob file',
      filePath: 'path path',
      fileType: 'file type',
    };

    const result = getReverRequestPayload(args);

    expect(result).toBe(args.file);
  });

  it('should return an object with the "name", "type" and "uri" keys in which "name" should be properly computed from the received "filePath" arg', () => {
    const args = {
      filePath: '/User/MyFiles/my-file.jpg',
      fileType: 'image/jpg',
    };

    const result = getReverRequestPayload(args);

    expect(result).toEqual({
      name: 'my-file.jpg',
      type: args.fileType,
      uri: args.filePath,
    });
  });
});
