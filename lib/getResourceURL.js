import config from './config';
export default function getResourceURL(mediaObject, options) {
  const url = mediaObject?.url;
  const mediaProvider = mediaObject?.provider;

  if (![config.mediaProviders.aws, config.mediaProviders.externalMinio].includes(mediaProvider))
    return url;

  const size = options?.size;
  if (size) return `${url}?size=${size}`;

  return url;
}
