import config from '../config';
import ReverMediaError from '../ReverMediaError';
export default function validateSize(args) {
  const size = args?.options?.size;
  if (!size) return;

  const validSizes = Object.keys(config.IMAGE_SIZES);

  if (!validSizes.includes(size)) {
    throw new ReverMediaError(
      `invalid size specified. Valid sizes are: ${validSizes.join(
        ', ',
      )} and can be found in the IMAGE_SIZES enum.`,
    );
  }
}
