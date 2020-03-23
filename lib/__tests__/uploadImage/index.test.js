import omit from 'lodash/omit';

import uploadImage from '../../uploadImage';
import uploadToRever from '../../uploadImage/uploadToRever';
import uploadToAzure from '../../uploadImage/uploadToAzure';

const mockUUID = 'i-am-a-mock-uuid';

jest.mock('uuidv4', () => ({ uuid: () => mockUUID }));

const baseArgs = {
  file: "I'm a blob file", // Web app will send this
  fileExtension: 'jpg',
  filePath: '/Folder/images/my-image.jpg', // Mobile app will send this
  fileType: 'image/jpg',
  organization: {
    _id: 'myOrgId',
    mediaProvider:
      'can be one of "AWS_S3" or "EXTERNAL_AZURE_STORAGE_SERVICE", set it depending on what you want to test',
  },
  reverToken: 'tokentokentoken',
  reverURL: 'https://env-app.reverscore.com/api/v1',
};

jest.mock('../../uploadImage/uploadToRever');
jest.mock('../../uploadImage/uploadToAzure');

describe('Upload image', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Args validation', () => {
    it('should throw an error if a Rever token is not specified', async () => {
      const args = omit(baseArgs, 'reverToken');
      await expect(uploadImage(args)).rejects.toThrow('"reverToken" param is required');
    });

    it('should throw an error if  Rever API URL is not specified', async () => {
      const args = omit(baseArgs, 'reverURL');
      await expect(uploadImage(args)).rejects.toThrow('"reverURL" param is required');
    });

    it("should throw an error if organization's id can not be determined is not specified", async () => {
      const args = omit(baseArgs, 'organization');
      await expect(uploadImage(args)).rejects.toThrow(
        '"organization" param should include a "_id" attribute',
      );
    });

    it('should throw an error if a blob file is received but no file extension is specified', async () => {
      const args = omit(baseArgs, 'fileExtension');
      await expect(uploadImage(args)).rejects.toThrow(
        '"fileExtension" param is required when "file" is sent',
      );
    });

    it('should throw an error if a file path is received but no file type is specified', async () => {
      const args = omit(baseArgs, 'fileType');
      await expect(uploadImage(args)).rejects.toThrow(
        '"fileType" param is required when "filePath" is sent. Please provide a file type string like "image/png", "image/jpeg", etc. More valid types can be found in https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types',
      );
    });

    it('should throw an error if none of file or filePath are passed', async () => {
      const args = omit(baseArgs, ['filePath', 'file']);
      await expect(uploadImage(args)).rejects.toThrow(
        'either one of "file" or "filePath" parameters is required',
      );
    });
  });

  it("should throw an error if there is not an uploading strategy for the organization's media provider", async () => {
    const args = {
      ...baseArgs,
      organization: { ...baseArgs.organization, mediaProvider: 'UNKNOWN_MEDIA_PROVIDER' },
    };

    await expect(uploadImage(args)).rejects.toThrow(
      `there is no uploading strategy for the "${args.organization.mediaProvider}" media provider`,
    );
  });

  it('should call the rever API uploader with the corresponding args when media provider is "AWS_S3"', async () => {
    const args = {
      ...baseArgs,
      organization: { ...baseArgs.organization, mediaProvider: 'AWS_S3' },
    };

    await uploadImage(args);

    expect(uploadToRever).toHaveBeenCalledWith({
      file: baseArgs.file,
      fileName: `${mockUUID}.${baseArgs.fileExtension}`,
      filePath: baseArgs.filePath,
      organizationId: baseArgs.organization._id,
      reverToken: baseArgs.reverToken,
      reverURL: baseArgs.reverURL,
    });
  });

  it('should call the Azure uploader with the proper args when media provider is "EXTERNAL_AZURE_STORAGE_SERVICE"', async () => {
    const args = {
      ...baseArgs,
      azureStorageToken: 'my azure storage token',
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'EXTERNAL_AZURE_STORAGE_SERVICE',
        providers__azure_storage_storageURL: 'azure storage URL',
      },
    };

    await uploadImage(args);

    expect(uploadToAzure).toHaveBeenCalledWith({
      azureStorageToken: args.azureStorageToken,
      azureStorageURL: args.organization.providers__azure_storage_storageURL,
      file: baseArgs.file,
      fileName: `${mockUUID}.${baseArgs.fileExtension}`,
      filePath: baseArgs.filePath,
      organizationId: baseArgs.organization._id,
      reverToken: baseArgs.reverToken,
      reverURL: baseArgs.reverURL,
    });
  });
});
