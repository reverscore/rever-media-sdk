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
    fileExtension: '.jpg',
  },
  organization: {
    mediaProvider:
      'can be one of "AWS_S3" or "EXTERNAL_AZURE_STORAGE_SERVICE", set it depending on what you want to test',
  },
  reverToken: 'my token',
  options: {
    size: 'square',
  },
};

describe('Fetch BLOB from Rever API', () => {
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
      reverMediaObject: {
        ...baseArgs.reverMediaObject,
        provider: 'AWS_S3',
      },
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'AWS_S3',
      },
    };

    await fetchBlob(args);

    expect(fetchFromRever).toHaveBeenCalledWith({
      url: `${baseArgs.reverMediaObject.url}?size=${baseArgs.options.size}`,
      reverToken: baseArgs.reverToken,
      mimeType: baseArgs.reverMediaObject.mimeType,
      fileExtension: 'jpg',
    });
  });

  it('should call the Rever API fetcher with the expected args when organizations\' media provider is "EXTERNAL_AZURE_STORAGE_SERVICE"', async () => {
    const args = {
      ...baseArgs,
      reverMediaObject: {
        ...baseArgs.reverMediaObject,
        provider: 'EXTERNAL_AZURE_STORAGE_SERVICE',
      },
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
      fileExtension: 'jpg',
    });
  });

  it('should include the "size" parameter in the resource URL ONLY when it is specified and the provider is AWS_S3', async () => {
    await fetchBlob({
      ...baseArgs,
      reverMediaObject: {
        ...baseArgs.reverMediaObject,
        provider: 'AWS_S3',
      },
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'AWS_S3',
      },
      options: {
        size: 'thumbnail',
      },
    });

    expect(fetchFromRever).toHaveBeenLastCalledWith({
      url: `${baseArgs.reverMediaObject.url}?size=thumbnail`,
      mimeType: baseArgs.reverMediaObject.mimeType,
      reverToken: baseArgs.reverToken,
      fileExtension: 'jpg',
    });

    await fetchBlob({
      ...baseArgs,
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'EXTERNAL_AZURE_STORAGE_SERVICE',
      },
      options: {
        size: 'thumbnail',
      },
    });

    expect(fetchFromAzure).toHaveBeenLastCalledWith({
      url: baseArgs.reverMediaObject.url,
      mimeType: baseArgs.reverMediaObject.mimeType,
      azureStorageToken: baseArgs.azureStorageToken,
      fileExtension: 'jpg',
    });

    await fetchBlob({
      ...omit(baseArgs, 'options'),
      organization: {
        ...baseArgs.organization,
        mediaProvider: 'AWS_S3',
      },
    });

    expect(fetchFromRever).toHaveBeenLastCalledWith({
      url: baseArgs.reverMediaObject.url,
      mimeType: baseArgs.reverMediaObject.mimeType,
      reverToken: baseArgs.reverToken,
      fileExtension: 'jpg',
    });
  });

  it('should throw an error if an invalid size is passed', async () => {
    const args = { ...baseArgs, options: { size: 'jumbo' } };

    await expect(fetchBlob(args)).rejects.toThrow(
      `invalid size specified. Valid sizes can be found in the IMAGE_SIZES enum exported by this module.`,
    );
  });
});
