import config from '../config';
import ReverMediaError from '../ReverMediaError';
export default function validateSize(args) {
  const size = args?.options?.size;
  if (!size) return;

  const validSizes = Object.values(config.IMAGE_SIZES);

  if (!validSizes.includes(size)) {
    throw new ReverMediaError(
      'invalid size specified. Valid sizes can be found in the IMAGE_SIZES enum exported by this module.',
    );
  }
}
