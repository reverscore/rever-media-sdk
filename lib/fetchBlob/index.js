import config from '../config';
import ReverMediaError from '../ReverMediaError';
import fetchFromRever from './rever';
import fetchFromAzure from './azure';
import validateSize from './validateSize';
import getResourceURL from '../getResourceURL';

export default async function fetchBlob(args = {}) {
  validateArgs(args);

  const fetch = getFetcher(args);

  const data = await fetch(buildFetchArgs(args));
  return data;
}

function validateArgs(args) {
  const { azureStorageToken, reverMediaObject, reverToken } = args;
  const mediaProvider = getProvider(args);
  const url = reverMediaObject?.url;

  if (!url) {
    throw new ReverMediaError(
      'image URL could not be determined using the provided Rever Media Object.',
    );
  }

  const mimeType = reverMediaObject?.mimeType;
  if (!mimeType) {
    throw new ReverMediaError(
      'image MIME type could not be determined using the provided Rever Media Object.',
    );
  }

  if (
    [config.mediaProviders.aws, config.mediaProviders.externalMinio].includes(mediaProvider) &&
    !reverToken
  ) {
    throw new ReverMediaError('"reverToken" param is required.');
  }

  if (mediaProvider === config.mediaProviders.externalAzureStorage && !azureStorageToken) {
    throw new ReverMediaError('"azureStorageToken" param is required.');
  }

  validateSize(args);
}

function getProvider(args) {
  const mediaObjectProvider = args?.reverMediaObject?.provider;
  const organizationProvider = args?.organization?.mediaProvider;
  return mediaObjectProvider || organizationProvider;
}

function getFetcher(args) {
  const mediaProvider = getProvider(args);

  switch (mediaProvider) {
    case config.mediaProviders.aws:
      return fetchFromRever;
    case config.mediaProviders.externalMinio:
      return fetchFromRever;
    case config.mediaProviders.externalAzureStorage:
      return fetchFromAzure;
    default:
      throw new ReverMediaError(
        `there is no fetching strategy for the "${mediaProvider}" media provider.`,
      );
  }
}

function buildFetchArgs(args) {
  const { azureStorageToken, reverMediaObject, reverToken, options } = args;
  const fetchArgs = {
    url: getResourceURL(reverMediaObject, options),
    mimeType: reverMediaObject?.mimeType,
    fileExtension: (reverMediaObject?.fileExtension ?? '').replace('.', ''),
  };

  const mediaProvider = getProvider(args);

  if ([config.mediaProviders.aws, config.mediaProviders.externalMinio].includes(mediaProvider)) {
    fetchArgs.reverToken = reverToken;
  }

  if (mediaProvider === config.mediaProviders.externalAzureStorage) {
    fetchArgs.azureStorageToken = azureStorageToken;
  }

  return fetchArgs;
}
