import getReverRequestPayload from '../../../upload/rever/buildRequestPayload';

describe('Build Rever upload request payload', () => {
  it('should return the "file" arg if it\'s received including the "isPublic" flag', () => {
    const args = {
      file: {},
      filePath: 'path path',
      fileType: 'file type',
      isPublic: true,
    };

    const payload = getReverRequestPayload(args);

    expect(payload).toBe(args.file);
    expect(payload.isPublic).toBe(args.isPublic);
  });

  it('should return an object with the "name", "type" and "uri" keys in which "name" should be properly computed from the received "filePath" arg', () => {
    const args = {
      filePath: '/User/MyFiles/my-file.jpg',
      fileType: 'image/jpg',
      fileName: 'my-file.jpg',
    };

    const payload = getReverRequestPayload(args);

    expect(payload).toEqual({
      name: args.fileName,
      type: args.fileType,
      uri: args.filePath,
      isPublic: false,
    });
  });
});
