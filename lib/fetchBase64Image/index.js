import ReverMediaError from '../ReverMediaError';
import fetchFromRever from './rever';
import fetchFromAzure from './azure';

const MEDIA_PROVIDERS = {
  AWS: 'AWS_S3',
  EXTERNAL_AZURE: 'EXTERNAL_AZURE_STORAGE_SERVICE',
};

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

  if (mediaProvider === MEDIA_PROVIDERS.AWS && !reverToken) {
    throw new ReverMediaError('"reverToken" param is required.');
  }

  if (mediaProvider === MEDIA_PROVIDERS.EXTERNAL_AZURE && !azureStorageToken) {
    throw new ReverMediaError('"azureStorageToken" param is required.');
  }
}

function getFetcherByOrganization(organization) {
  const mediaProvider = organization?.mediaProvider;

  switch (mediaProvider) {
    case MEDIA_PROVIDERS.AWS:
      return fetchFromRever;
    case MEDIA_PROVIDERS.EXTERNAL_AZURE:
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
  if (mediaProvider === MEDIA_PROVIDERS.AWS) {
    fetchArgs.reverToken = reverToken;
  }

  if (mediaProvider === MEDIA_PROVIDERS.EXTERNAL_AZURE) {
    fetchArgs.azureStorageToken = azureStorageToken;
  }

  return fetchArgs;
}
