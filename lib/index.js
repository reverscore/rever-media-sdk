import init from './init';
import getResourceURL from './getResourceURL';
import config from './config';

export default { init, getResourceURL, IMAGE_SIZES: config.IMAGE_SIZES };

export { default as init } from './init';
export { default as getResourceURL } from './getResourceURL';
export const IMAGE_SIZES = config.IMAGE_SIZES;
