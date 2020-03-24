import { uuid } from 'uuidv4';

import ReverMediaError from '../ReverMediaError';

import uploadToRever from './rever';
import uploadToAzure from './azure';

const MEDIA_PROVIDERS = {
  AWS: 'AWS_S3',
  EXTERNAL_AZURE: 'EXTERNAL_AZURE_STORAGE_SERVICE',
};

export default async function upload(args = {}) {
  validateArgs(args);

  const upload = getUploaderByOrganization(args.organization);

  const reverMediaObject = await upload(buildUploaderArgs(args));
  return reverMediaObject;
}

function validateArgs(args) {
  const { file, fileExtension, filePath, fileType, reverToken, organization, reverURL } = args;
  const organizationId = organization?._id || organization?.id;

  if (!reverURL) throw new ReverMediaError('"reverURL" param is required');

  if (!reverToken) throw new ReverMediaError('"reverToken" param is required');

  if (!organizationId) {
    throw new ReverMediaError('"organization" param should include a "_id" attribute');
  }

  if (!fileType) {
    throw new ReverMediaError(
      '"fileType" param is required. Please provide a file type string like "image/png", "image/jpeg", etc. More valid types can be found in https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types',
    );
  }

  if (file && !fileExtension) {
    throw new ReverMediaError('"fileExtension" param is required when "file" is sent');
  }

  if (!file && !filePath) {
    throw new ReverMediaError('either one of "file" or "filePath" parameters is required');
  }
}

function getUploaderByOrganization(organization) {
  const mediaProvider = organization?.mediaProvider;

  switch (mediaProvider) {
    case MEDIA_PROVIDERS.AWS:
      return uploadToRever;
    case MEDIA_PROVIDERS.EXTERNAL_AZURE:
      return uploadToAzure;
    default:
      throw new ReverMediaError(
        `there is no uploading strategy for the "${mediaProvider}" media provider`,
      );
  }
}

function buildUploaderArgs(args) {
  const uploaderArgs = {
    file: args?.file,
    fileName: buildFileName(args),
    fileType: args?.fileType,
    organizationId: args?.organization?._id,
    reverToken: args?.reverToken,
    reverURL: args?.reverURL,
  };

  const filePath = args?.filePath;
  if (filePath) uploaderArgs.filePath = filePath;

  const azureStorageURL = args?.organization?.providers__azure_storage_storageURL;
  if (azureStorageURL) uploaderArgs.azureStorageURL = azureStorageURL;

  const azureStorageToken = args?.azureStorageToken;
  if (azureStorageToken) uploaderArgs.azureStorageToken = azureStorageToken;

  return uploaderArgs;
}

function buildFileName(args) {
  const { file, filePath, fileExtension } = args;

  // Using the "replace" method we support the cases where user sends '.jpg' or just 'jpg'
  if (file) return `${uuid()}.${fileExtension.replace('.', '')}`;
  if (filePath) return filePath.substring(filePath.lastIndexOf('/') + 1);
  return '';
}
