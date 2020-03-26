import ReverMediaClient from '../ReverMediaClient';
import upload from '../upload';
import fetchBase64Image from '../fetchBase64Image';

jest.mock('../upload');
jest.mock('../fetchBase64Image');

const baseArgs = {
  azureStorageToken: 'azure token',
  organization: {},
  reverToken: 'rever token',
  reverURL: 'http//rever.com',
};

describe('Rever Media Client API', () => {
  it('should assing all the received args on init as instance variables', () => {
    const instance = createInstance();

    expect(instance.azureStorageToken).toBe(baseArgs.azureStorageToken);
    expect(instance.organization).toEqual(baseArgs.organization);
    expect(instance.reverToken).toBe(baseArgs.reverToken);
    expect(instance.reverURL).toBe(baseArgs.reverURL);
  });

  it('should call the upload instance method with the expected args', () => {
    const instance = createInstance();
    const args = {
      file: 'file',
      fileExtension: 'jpg',
      filePath: 'my/Path',
      fileType: 'image/jpg',
    };

    instance.upload(args);

    expect(upload).toHaveBeenCalledWith({
      ...args,
      azureStorageToken: baseArgs.azureStorageToken,
      organization: baseArgs.organization,
      reverToken: baseArgs.reverToken,
      reverURL: baseArgs.reverURL,
    });
  });

  it('should call the fetch image instance method with the expected args', () => {
    const instance = createInstance();
    const reverMediaObject = { id: 'someid' };

    instance.fetchBase64Image(reverMediaObject);

    expect(fetchBase64Image).toHaveBeenCalledWith({
      azureStorageToken: baseArgs.azureStorageToken,
      organization: baseArgs.organization,
      reverMediaObject,
      reverToken: baseArgs.reverToken,
    });
  });

  test('the "setAzureStorageToken" should modify the current Azure token and set the new one', () => {
    const instance = createInstance();
    const newAzureStorageToken = 'a brand new Azure Token!';

    instance.setAzureStorageToken(newAzureStorageToken);

    expect(instance.azureStorageToken).not.toBe(baseArgs.azureStorageToken);
    expect(instance.azureStorageToken).toBe(newAzureStorageToken);
  });
});

function createInstance(args = baseArgs) {
  return new ReverMediaClient(args);
}
