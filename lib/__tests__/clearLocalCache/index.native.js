import { mockSession, mockDispose } from 'rn-fetch-blob';
import clearLocalCache from '../../clearLocalCache/index.native';

describe('Clear local cache for React Native clients', () => {
  it('should call the corresponding RNFetchBlob methods', async () => {
    await clearLocalCache();
    expect(mockSession).toHaveBeenCalled();
    expect(mockDispose).toHaveBeenCalled();
  });
});
