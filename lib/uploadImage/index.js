import { uuid } from 'uuidv4';

import ReverMediaError from '../ReverMediaError';

import uploadToRever from './uploadToRever';

export default async function uploadImage(args = {}) {
  validateArgs(args);

  const upload = getUploaderByOrganization(args.organization);

  const reverMediaObject = await upload(buildUploaderArgs(args));
  return reverMediaObject;
}

function validateArgs(args) {
  const { file, fileExtension, filePath, reverToken, organization, reverURL } = args;
  const organizationId = organization?._id;

  if (!reverURL) throw new ReverMediaError('"reverURL" param is required');

  if (!reverToken) throw new ReverMediaError('"reverToken" param is required');

  if (!organizationId) {
    throw new ReverMediaError('"organization" param should include a "_id" attribute');
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

  if (mediaProvider === 'AWS_S3') return uploadToRever;

  throw new ReverMediaError(
    `there is no uploading strategy for the "${mediaProvider}" media provider`,
  );
}

function buildUploaderArgs(args) {
  const uploaderArgs = {
    fieldName: 'file', // Fixed value, it should always be "file"
    file: args?.file,
    organizationId: args?.organization?._id,
    fileName: args?.fileName,
    reverToken: args?.reverToken,
    reverURL: args?.reverURL,
  };

  const file = args?.file;
  if (file) uploaderArgs.fileName = buildFileName(args);

  const filePath = args?.filePath;
  if (filePath) uploaderArgs.filePath = filePath;

  return uploaderArgs;
}

function buildFileName(args) {
  const { fileExtension } = args;
  return `${uuid()}.${fileExtension}`;
}
