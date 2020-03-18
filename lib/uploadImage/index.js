import ReverMediaError from '../ReverMediaError';

import uploadToRever from './uploadToRever';

export default async function uploadImage(args = {}) {
  validateArgs(args);

  const upload = getUploaderByOrganization(args.organization);

  const reverMediaObject = await upload(buildUploaderArgs(args));
  return reverMediaObject;
}

function validateArgs(args) {
  const { fileName, filePath, data, reverToken, organization } = args;
  const organizationId = organization?._id;

  if (!reverToken) throw new ReverMediaError('"reverToken" param is required');

  if (!organizationId) {
    throw new ReverMediaError('"organization" param should include a "_id" attribute');
  }

  if (!fileName) throw new ReverMediaError('"fileName" param is required');

  if (!filePath && !data) {
    throw new ReverMediaError('either one of "filePath" or "data" parameter is required');
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
    organizationId: args?.organization?._id,
    fileName: args?.fileName,
  };

  const data = args?.data;
  if (data) uploaderArgs.file = data;

  const filePath = args?.filePath;
  if (filePath) uploaderArgs.filePath = filePath;

  return uploaderArgs;
}
