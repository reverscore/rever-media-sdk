import RNFetchBlob from 'rn-fetch-blob';

import ReverMediaError from '../../ReverMediaError';

export default async function fetchFromRever(args) {
  const { url } = args;
  const headers = buildHeaders(args);

  const response = await RNFetchBlob.fetch('GET', url, headers).catch(handleFetchError);

  try {
    const base64 = response?.base64?.();
    return base64;
  } catch (err) {
    return handleParsingError(err);
  }
}

function buildHeaders(args) {
  return {
    Authorization: args.reverToken,
  };
}

function handleFetchError(err) {
  throw new ReverMediaError(
    `an error occurred trying to fetch the image.\nRever API error: ${err?.message ??
      'No error details.'}`,
  );
}

function handleParsingError(err) {
  throw new ReverMediaError(
    `an error occurred trying to parse the image.\nParsing error: ${err?.message ??
      'No error details.'}`,
  );
}
