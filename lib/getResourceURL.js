import config from './config';
export default function getResourceURL(mediaObject, options) {
  const url = mediaObject?.url;
  const mediaProvider = mediaObject?.provider;

  if (mediaProvider !== config.mediaProviders.aws) return url;

  const size = options?.size;
  if (size) return `${url}?size=${size}`;

  return url;
}
