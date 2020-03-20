import axios from 'axios';

// This is a fixed name expected by Rever API.
const FILE_FIELD_NAME = 'file';

export default async function uploadToReverAPI(args) {
  const endpoint = buildEndpoint(args);
  const data = buildFormData(args);
  const config = buildRequestConfig(args);

  const response = await axios.post(endpoint, data, config);

  return response.data;
}

function buildEndpoint(args) {
  return `${args.reverURL}/organizations/${args.organizationId}/media/upload`;
}

function buildFormData(args) {
  const { fileName } = args;
  const formData = new FormData();
  const payload = getPayload(args);

  if (payload instanceof Blob) {
    formData.append(FILE_FIELD_NAME, payload, fileName);
  } else {
    formData.append(FILE_FIELD_NAME, payload);
  }

  return formData;
}

function getPayload(args) {
  const { file, filePath, fileType } = args;
  if (file) return file;

  const fileNameFromPath = filePath.substring(filePath.lastIndexOf('/') + 1);

  return {
    name: fileNameFromPath,
    type: fileType,
    uri: filePath,
  };
}

function buildRequestConfig(args) {
  return {
    headers: {
      Authorization: args?.reverToken,
    },
  };
}
