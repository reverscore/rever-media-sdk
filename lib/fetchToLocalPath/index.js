import ReverMediaError from '../ReverMediaError';

export default async function fetchToLocalPath() {
  throw new ReverMediaError(`blob files caching is not supported for Web clients yet.`);
}
