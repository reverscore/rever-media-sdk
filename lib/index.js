import config from './config';
import init from './init';
import getResourceURL from './getResourceURL';
import clearLocalCache from './clearLocalCache';

export default { init, getResourceURL, clearLocalCache, IMAGE_SIZES: config.IMAGE_SIZES };

export { default as init } from './init';
export { default as getResourceURL } from './getResourceURL';
export { default as clearLocalCache } from './clearLocalCache';
export const IMAGE_SIZES = config.IMAGE_SIZES;
