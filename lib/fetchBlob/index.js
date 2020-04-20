import config from '../config';
import ReverMediaError from '../ReverMediaError';
import fetchFromRever from './rever';
import fetchFromAzure from './azure';
import validateSize from './validateSize';

export default async function fetchBlob(args = {}) {
  const { organization } = args;

  validateArgs(args);

  const fetch = getFetcherByOrganization(organization);

  const data = await fetch(buildFetchArgs(args));
  return data;
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

  validateSize(args);
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
    url: buildURL(args),
    mimeType: reverMediaObject?.mimeType,
    fileExtension: reverMediaObject?.fileExtension,
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

function buildURL(args) {
  const { reverMediaObject, options, organization } = args;
  const url = reverMediaObject?.url;
  const mediaProvider = organization?.mediaProvider;

  if (mediaProvider !== config.mediaProviders.aws) return url;

  const size = options?.size;
  if (size) return `${url}?size=${size}`;

  return url;
}
