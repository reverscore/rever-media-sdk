import axios from 'axios';

import supportedFileTypes from '../supportedFileTypes';

export default async function createReverMediaObject(args) {
  const endpoint = buildReverEndpoint(args);
  const data = buildData(args);
  const requestConfig = buildRequestConfig(args);
  const response = await axios.post(endpoint, data, requestConfig);
  return response.data;
}

function buildReverEndpoint(args) {
  const { reverURL, organizationId } = args;
  return `${reverURL}/organizations/${organizationId}/media`;
}

function buildRequestConfig(args) {
  return {
    headers: {
      Authorization: args.reverToken,
    },
  };
}

function buildData(args) {
  return {
    providerId: getProviderId(args),
    providerContainerName: getProviderContainerName(args),
    providerURI: `${args.azureStorageURL}/${args.fileName}`,
    mimeType: args.fileType,
    resourceType: getResourceType(args),
    originalFileName: args?.file?.name ?? args?.fileName,
    fileExtension: getFileExtension(args),
    bytes: args?.file?.size ?? 0,
  };
}

function getProviderId(args) {
  const { fileName } = args;
  const azureContainerName = getProviderContainerName(args);
  const fileNameWithoutExtension = fileName.split('.')[0];

  return `${azureContainerName}/${fileNameWithoutExtension}`;
}

function getProviderContainerName(args) {
  const { azureStorageURL } = args;
  return azureStorageURL
    .replace(/\/$/, '')
    .split('/')
    .pop();
}

function getResourceType(args) {
  const fileType = supportedFileTypes.find(t => t.mimeType === args.fileType);
  return fileType.resourceType;
}

function getFileExtension(args) {
  const { fileName } = args;
  return `.${fileName.split('.').pop()}`;
}
