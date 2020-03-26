import config from '../config';
import ReverMediaError from '../ReverMediaError';
import fetchFromRever from './rever';
import fetchFromAzure from './azure';

export default async function fetchBase64Image(args = {}) {
  const { organization } = args;

  validateArgs(args);

  const fetch = getFetcherByOrganization(organization);

  const base64String = await fetch(buildFetchArgs(args));
  return base64String;
}

function validateArgs(args) {
  const { azureStorageToken, reverMediaObject, reverToken, organization } = args;
  const mediaProvider = organization?.mediaProvider;

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

  if (mediaProvider === config.mediaProviders.aws && !reverToken) {
    throw new ReverMediaError('"reverToken" param is required.');
  }

  if (mediaProvider === config.mediaProviders.externalAzureStorage && !azureStorageToken) {
    throw new ReverMediaError('"azureStorageToken" param is required.');
  }
}

function getFetcherByOrganization(organization) {
  const mediaProvider = organization?.mediaProvider;

  switch (mediaProvider) {
    case config.mediaProviders.aws:
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
  const { azureStorageToken, reverMediaObject, reverToken, organization } = args;
  const fetchArgs = {
    url: reverMediaObject?.url,
    mimeType: reverMediaObject?.mimeType,
  };

  const mediaProvider = organization?.mediaProvider;
  if (mediaProvider === config.mediaProviders.aws) {
    fetchArgs.reverToken = reverToken;
  }

  if (mediaProvider === config.mediaProviders.externalAzureStorage) {
    fetchArgs.azureStorageToken = azureStorageToken;
  }

  return fetchArgs;
}
