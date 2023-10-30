import download from '../../download/index.native';
import ReverMediaError from '../../ReverMediaError';
import ReactNativeBlobUtil from 'react-native-blob-util';

jest.mock('react-native-blob-util', () => ({
  config: jest.fn(() => ({
    fetch: jest.fn().mockResolvedValue({
      path: () => '/downloads',
    }),
  })),
}));

describe('download', () => {
  it('download a file successfully', async () => {
    const args = {
      reverMediaObject: {
        url: 'downloads',
        fileExtension: '.jpg',
      },
      reverToken: 'token',
    };

    try {
      const response = await download(args);
      expect(response.path()).toEqual('/downloads');
    } catch (err) {
      throw err;
    }
  });

  it('handle errors correctly', async () => {
    jest.spyOn(ReactNativeBlobUtil, 'config').mockImplementation(() => ({
      fetch: jest.fn().mockRejectedValue(new Error('Simulated error')),
    }));

    const args = {
      reverMediaObject: {
        url: 'downloads',
        fileExtension: '.jpg',
      },
      reverToken: 'token',
    };

    try {
      await download(args);
    } catch (err) {
      expect(err).toBeInstanceOf(ReverMediaError);
    }
  });
});
