import axios from 'axios';

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
  const { fieldName } = args;
  const formData = new FormData();
  const payload = getPayload(args);

  formData.append(fieldName, payload);

  return formData;
}

function getPayload(args) {
  const { fieldName, filePath, fileName, file } = args;
  if (file) return file;
  if (filePath) return JSON.stringify({ fieldName, fileName, filePath });
}

function buildRequestConfig(args) {
  return {
    headers: {
      Authorization: args?.reverToken,
    },
  };
}
