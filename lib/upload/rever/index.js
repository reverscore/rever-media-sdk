import axios from 'axios';

import buildRequestPayload from './buildRequestPayload';

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
  const payload = buildRequestPayload(args);

  if (payload instanceof Blob) {
    // Using payload?.name we can preserve the original filename instead of the one with an UUID
    formData.append(FILE_FIELD_NAME, payload, payload?.name ?? fileName);
  } else {
    formData.append(FILE_FIELD_NAME, payload);
  }

  return formData;
}

function buildRequestConfig(args) {
  return {
    headers: {
      Authorization: args?.reverToken,
    },
  };
}
