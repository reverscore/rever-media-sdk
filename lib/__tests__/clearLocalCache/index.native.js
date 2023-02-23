import { mockSession, mockDispose } from 'react-native-blob-util';
import clearLocalCache from '../../clearLocalCache/index.native';

describe('Clear local cache for React Native clients', () => {
  it('should call the corresponding ReactNativeBlobUtil methods', async () => {
    await clearLocalCache();
    expect(mockSession).toHaveBeenCalled();
    expect(mockDispose).toHaveBeenCalled();
  });
});
