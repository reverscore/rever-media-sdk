import ReverMediaError from '../ReverMediaError';
import fetchFromRever from './rever';

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
  const { reverMediaObject, reverToken } = args;

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

  if (!reverToken) {
    throw new ReverMediaError('"reverToken" param is required.');
  }
}

function getFetcherByOrganization(organization) {
  const mediaProvider = organization?.mediaProvider;

  switch (mediaProvider) {
    case MEDIA_PROVIDERS.AWS:
      return fetchFromRever;
    default:
      throw new ReverMediaError(
        `there is no fetching strategy for the "${mediaProvider}" media provider.`,
      );
  }
}

function buildFetchArgs(args) {
  const { reverMediaObject, reverToken } = args;
  return {
    url: reverMediaObject?.url,
    reverToken: reverToken,
    mimeType: reverMediaObject?.mimeType,
  };
}
