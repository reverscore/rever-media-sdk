import RNFetchBlob from 'rn-fetch-blob';

export default function clearLocalCache() {
  return RNFetchBlob.session().dispose();
}
