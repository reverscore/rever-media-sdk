import omit from 'lodash/omit';
import fetchBlob from '../../fetchBlob';
import fetchFromRever from '../../fetchBlob/rever';
import fetchFromAzure from '../../fetchBlob/azure';

jest.mock('../../fetchBlob/rever');
jest.mock('../../fetchBlob/azure');

const baseArgs = {
  azureStorageToken: 'azure token',
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

    await expect(fetchBlob(args)).rejects.toThrow(
      `there is no fetching strategy for the "${args.organization.mediaProvider}" media provider.`,
    );
  });

  it('should throw an error if the image URL can not be extracted from the provided Rever Media object', async () => {
    const args = {
      ...baseArgs,
      reverMediaObject: { mimeType: 'some mime type' },
    };

    await expect(fetchBlob(args)).rejects.toThrow(
      `image URL could not be determined using the provided Rever Media Object.`,
    );
  });

  it('should throw an error if MIME type can not be extracted from the provided Rever Media object', async () => {
    const args = {
      ...baseArgs,
      reverMediaObject: { url: 'https://myurl.com' },
    };

    await expect(fetchBlob(args)).rejects.toThrow(
      `image MIME type could not be determined using the provided Rever Media Object.`,
    );
  });

  it('should throw an error if Rever token is not provided when media provider is "AWS_S3"', async () => {
    const args = {
      ...omit(baseArgs, 'reverToken'),
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'AWS_S3',
      },
    };
    await expect(fetchBlob(args)).rejects.toThrow(`"reverToken" param is required.`);
  });

  it('should throw an error if Azure Storage token is not provided when media provider is "EXTERNAL_AZURE_STORAGE_SERVICE"', async () => {
    const args = {
      ...omit(baseArgs, 'azureStorageToken'),
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'EXTERNAL_AZURE_STORAGE_SERVICE',
      },
    };
    await expect(fetchBlob(args)).rejects.toThrow(`"azureStorageToken" param is required.`);
  });

  it('should call the Rever API fetcher with the expected args when organizations\' media provider is "AWS_S3"', async () => {
    const args = {
      ...baseArgs,
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'AWS_S3',
      },
    };

    await fetchBlob(args);

    expect(fetchFromRever).toHaveBeenCalledWith({
      url: baseArgs.reverMediaObject.url,
      reverToken: baseArgs.reverToken,
      mimeType: baseArgs.reverMediaObject.mimeType,
    });
  });

  it('should call the Rever API fetcher with the expected args when organizations\' media provider is "EXTERNAL_AZURE_STORAGE_SERVICE"', async () => {
    const args = {
      ...baseArgs,
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'EXTERNAL_AZURE_STORAGE_SERVICE',
      },
    };

    await fetchBlob(args);

    expect(fetchFromAzure).toHaveBeenCalledWith({
      url: baseArgs.reverMediaObject.url,
      azureStorageToken: baseArgs.azureStorageToken,
      mimeType: baseArgs.reverMediaObject.mimeType,
    });
  });
});
