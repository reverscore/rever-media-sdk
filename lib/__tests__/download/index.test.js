import fileDownload from 'js-file-download';
import download from '../../download';
import fetchBlob from '../../fetchBlob';

jest.mock('js-file-download');
jest.mock('../../fetchBlob');

describe('Download Blob file for Web clients', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call the "fetchBlob" function and delegate the download process to the "js-file-download" module', async () => {
    const mockBuffer = 'myarraybuffer';
    fetchBlob.mockReturnValueOnce(Promise.resolve(mockBuffer));

    const args = {
      reverMediaObject: { originalFileName: 'myfilename.jpg', mimeType: 'image/jpg' },
    };

    await download(args);

    expect(fetchBlob).toHaveBeenCalledWith(args);
    expect(fileDownload).toHaveBeenCalledWith(
      mockBuffer,
      args.reverMediaObject.originalFileName,
      args.reverMediaObject.mimeType,
    );
  });
});
