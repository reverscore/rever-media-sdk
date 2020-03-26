import download from '../../download';
import fetchBlob from '../../fetchBlob';

jest.mock('../../fetchBlob');

describe('Download Blob file for Web clients', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call the "fetchBlob" function, generate an HTML <a> element, click it and remove it from the DOM after the file download has been triggered', async () => {
    const ANCHOR_HTML_ELEMENT_TAG = 'a';
    const DEFAULT_OBJECT_URL = 'http://localhost/';

    const mockBlob = new Blob();
    const mockLinkElement = document.createElement(ANCHOR_HTML_ELEMENT_TAG);

    window.URL.createObjectURL = jest.fn().mockReturnValueOnce('');
    jest.spyOn(document, 'createElement').mockReturnValueOnce(mockLinkElement);
    jest.spyOn(document.body, 'appendChild');
    jest.spyOn(document.body, 'removeChild');
    jest.spyOn(mockLinkElement, 'click');

    fetchBlob.mockReturnValueOnce(mockBlob);

    const args = {
      reverMediaObject: { originalFileName: 'myfilename.jpg' },
    };

    await download(args);

    expect(fetchBlob).toHaveBeenCalledWith(args);
    expect(document.createElement).toHaveBeenCalledWith(ANCHOR_HTML_ELEMENT_TAG);
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockLinkElement.href).toBe(DEFAULT_OBJECT_URL);
    expect(mockLinkElement.download).toBe(args.reverMediaObject.originalFileName);
    expect(mockLinkElement.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLinkElement);
  });
});
