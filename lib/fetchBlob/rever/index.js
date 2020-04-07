import axios from 'axios';

import ReverMediaError from '../../ReverMediaError';

export default async function fetchFromRever(args) {
  const { url } = args;
  const config = buildConfig(args);

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (err) {
    throw new ReverMediaError(
      `something happened trying to fetch the image from Rever API.\nRever API error: ${err?.message ??
        'No details.'}`,
    );
  }
}

function buildConfig(args) {
  return {
    responseType: 'arraybuffer',
    headers: {
      Authorization: args.reverToken,
    },
  };
}
