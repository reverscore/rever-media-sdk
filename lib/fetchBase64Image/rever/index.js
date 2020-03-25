import axios from 'axios';

import ReverMediaError from '../../ReverMediaError';
import parseBlobToBase64 from '../parseBlobToBase64';

export default async function fetchFromRever(args) {
  const { url, mimeType } = args;
  const config = buildConfig(args);

  try {
    const response = await axios.get(url, config);
    return parseBlobToBase64({ blob: response.data, mimeType });
  } catch (err) {
    handleFetchError(err);
  }
}

function buildConfig(args) {
  return {
    headers: {
      Authorization: args.reverToken,
    },
  };
}

function handleFetchError(err) {
  throw new ReverMediaError(
    `something happened trying to fetch the image from Rever API.\nRever API error: ${err.message}`,
  );
}
