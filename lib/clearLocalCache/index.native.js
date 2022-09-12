import ReactNativeBlobUtil from 'react-native-blob-util';

export default function clearLocalCache() {
  return ReactNativeBlobUtil.session().dispose();
}
