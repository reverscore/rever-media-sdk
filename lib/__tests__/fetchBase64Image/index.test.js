import omit from 'lodash/omit';
import fetchBase64Image from '../../fetchBase64Image';
import fetchFromRever from '../../fetchBase64Image/rever';

jest.mock('../../fetchBase64Image/rever');

const baseArgs = {
  reverMediaObject: {
    url: 'http://env-app.reverscore.com/api/v1/media/5e7524dc6d464e00110dfc74/download',
    mimeType: 'image/jpg',
  },
  organization: {
    mediaProvider:
      'can be one of "AWS_S3" or "EXTERNAL_AZURE_STORAGE_SERVICE", set it depending on what you want to test',
  },
  reverToken: 'my token',
};

describe('Fetch image from Rever API', () => {
  it('should throw an error if media provider can not be determined', async () => {
    const args = {
      ...baseArgs,
      organization: {
        mediaProvider: 'I_DONT_EVEN_EXIST',
      },
    };

    await expect(fetchBase64Image(args)).rejects.toThrow(
      `there is no fetching strategy for the "${args.organization.mediaProvider}" media provider.`,
    );
  });

  it('should throw an error if the image URL can not be extracted from the provided Rever Media object', async () => {
    const args = {
      ...baseArgs,
      reverMediaObject: { mimeType: 'some mime type' },
    };

    await expect(fetchBase64Image(args)).rejects.toThrow(
      `image URL could not be determined using the provided Rever Media Object.`,
    );
  });

  it('should throw an error if MIME type can not be extracted from the provided Rever Media object', async () => {
    const args = {
      ...baseArgs,
      reverMediaObject: { url: 'https://myurl.com' },
    };

    await expect(fetchBase64Image(args)).rejects.toThrow(
      `image MIME type could not be determined using the provided Rever Media Object.`,
    );
  });

  it('should throw an error if Rever token is not provided', async () => {
    await expect(fetchBase64Image(omit(baseArgs, 'reverToken'))).rejects.toThrow(
      `"reverToken" param is required.`,
    );
  });

  it('should call the Rever API fetcher with the expected args when organizations\' media provider is "AWS_S3"', async () => {
    const args = {
      ...baseArgs,
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'AWS_S3',
      },
    };

    await fetchBase64Image(args);

    expect(fetchFromRever).toHaveBeenCalledWith({
      url: baseArgs.reverMediaObject.url,
      reverToken: baseArgs.reverToken,
      mimeType: baseArgs.reverMediaObject.mimeType,
    });
  });
});
