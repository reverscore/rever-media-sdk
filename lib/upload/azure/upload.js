import axios from 'axios';

import buildRequestArgs from './buildRequestArgs';

export default async function uploadForWeb(args = {}) {
  const { endpoint, config } = buildRequestArgs(args);
  const payload = args.file;

  const response = await axios.put(endpoint, payload, config);
  return response?.data;
}
