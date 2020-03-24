import omit from 'lodash/omit';

import upload from '../../upload';
import uploadToRever from '../../upload/rever';
import uploadToAzure from '../../upload/azure';

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

jest.mock('../../upload/rever');
jest.mock('../../upload/azure');

describe('Upload image', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if a Rever token is not specified', async () => {
    const args = omit(baseArgs, 'reverToken');
    await expect(upload(args)).rejects.toThrow('"reverToken" param is required');
  });

  it('should throw an error if  Rever API URL is not specified', async () => {
    const args = omit(baseArgs, 'reverURL');
    await expect(upload(args)).rejects.toThrow('"reverURL" param is required');
  });

  it("should throw an error if organization's id can not be determined is not specified", async () => {
    const args = omit(baseArgs, 'organization');
    await expect(upload(args)).rejects.toThrow(
      '"organization" param should include a "_id" attribute',
    );
  });

  it('should throw an error if a blob file is received but no file extension is specified', async () => {
    const args = omit(baseArgs, 'fileExtension');
    await expect(upload(args)).rejects.toThrow(
      '"fileExtension" param is required when "file" is sent',
    );
  });

  it('should throw an error if file type is not specified', async () => {
    const args = omit(baseArgs, 'fileType');
    await expect(upload(args)).rejects.toThrow(
      '"undefined" is an invalid file type. Please provide a file type string like "image/png", "image/jpeg", etc. For a list of supported file types please refer to: https://github.com/reverscore/rever-media-sdk/wiki/Supported-File-Types',
    );
  });

  it('should throw an error if none of file or filePath are passed', async () => {
    const args = omit(baseArgs, ['filePath', 'file']);
    await expect(upload(args)).rejects.toThrow(
      'either one of "file" or "filePath" parameters is required',
    );
  });

  it("should throw an error if there is not an uploading strategy for the organization's media provider", async () => {
    const args = {
      ...baseArgs,
      organization: { ...baseArgs.organization, mediaProvider: 'UNKNOWN_MEDIA_PROVIDER' },
    };

    await expect(upload(args)).rejects.toThrow(
      `there is no uploading strategy for the "${args.organization.mediaProvider}" media provider`,
    );
  });

  it('should call the rever API uploader with the corresponding args when media provider is "AWS_S3" and a file path is sent', async () => {
    const args = {
      ...baseArgs,
      file: undefined,
      organization: { ...baseArgs.organization, mediaProvider: 'AWS_S3' },
    };

    await upload(args);

    expect(uploadToRever).toHaveBeenCalledWith({
      fileName: 'my-image.jpg',
      filePath: baseArgs.filePath,
      fileType: baseArgs.fileType,
      organizationId: baseArgs.organization._id,
      reverToken: baseArgs.reverToken,
      reverURL: baseArgs.reverURL,
    });
  });

  it('should call the Azure uploader with the proper args when media provider is "EXTERNAL_AZURE_STORAGE_SERVICE" and a file is sent', async () => {
    const args = {
      ...baseArgs,
      azureStorageToken: 'my azure storage token',
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'EXTERNAL_AZURE_STORAGE_SERVICE',
        providers__azure_storage_storageURL: 'azure storage URL',
      },
    };

    await upload(args);

    expect(uploadToAzure).toHaveBeenCalledWith({
      azureStorageToken: args.azureStorageToken,
      azureStorageURL: args.organization.providers__azure_storage_storageURL,
      file: baseArgs.file,
      fileName: `${mockUUID}.${baseArgs.fileExtension}`,
      filePath: baseArgs.filePath,
      fileType: baseArgs.fileType,
      organizationId: baseArgs.organization._id,
      reverToken: baseArgs.reverToken,
      reverURL: baseArgs.reverURL,
    });
  });
});
