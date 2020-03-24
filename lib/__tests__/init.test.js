import axios from 'axios';
import { get, omit } from 'lodash';

import init from '../init';
import ReverMediaClient from '../ReverMediaClient';

describe('Init SDK', () => {
  const baseArgs = Object.freeze({
    reverURL: 'https//env-api.reverscore.com/api/v1',
    reverToken: 'i-wanna-make-a-supersonic-token-of-you',
    organizationId: 'myOrgId',
    azureStorageToken: 'mySuperDuperLongAzureStorageToken',
  });

  it('should throw an error if Rever API URL is not specified', async () => {
    await expect(init()).rejects.toThrow('"reverURL" param is required');
  });

  it('should throw an error if Rever session token is not specified', async () => {
    const args = omit(baseArgs, 'reverToken');
    await expect(init(args)).rejects.toThrow('"reverToken" param is required');
  });

  it('should throw an error if organization id is not specified', async () => {
    const args = omit(baseArgs, 'organizationId');
    await expect(init(args)).rejects.toThrow('"organizationId" param is required');
  });

  it('should fetch organization data from the specified Rever API URL, using the specified id and session token', async () => {
    jest.spyOn(axios, 'get').mockReturnValueOnce(Promise.resolve({}));

    await init(baseArgs);

    const actualArgs = get(axios, 'get.mock.calls[0]');
    const expectedURL = `${baseArgs.reverURL}/organizations/${baseArgs.organizationId}`;
    const expectedRequestArgs = {
      headers: { Authorization: baseArgs.reverToken },
    };

    expect(actualArgs).toEqual([expectedURL, expectedRequestArgs]);
  });

  it('should throw a explicit error when organization data can not be fetched', async () => {
    jest.spyOn(axios, 'get').mockReturnValueOnce(Promise.reject(new Error('Something happened!')));

    await expect(init(baseArgs)).rejects.toThrow(
      `An error ocurred trying to get organization with id ${
        baseArgs.organizationId
      }.\nInit args: ${JSON.stringify(baseArgs)}`,
    );
  });

  it('should return an instance of rever SDK initialized with the fetched organization data, Rever token, Rever URL and Azure token', async () => {
    const mockOrganization = {
      _id: 'myorg',
      name: 'Mock Rever Org',
    };

    jest.spyOn(axios, 'get').mockReturnValueOnce(
      Promise.resolve({
        data: mockOrganization,
      }),
    );

    const reverMedia = await init(baseArgs);

    expect(reverMedia).toBeInstanceOf(ReverMediaClient);
    expect(reverMedia.organization).toEqual(mockOrganization);
    expect(reverMedia.reverURL).toEqual(baseArgs.reverURL);
    expect(reverMedia.reverToken).toEqual(baseArgs.reverToken);
    expect(reverMedia.azureToken).toEqual(baseArgs.azureToken);
  });

  it('should throw an error if the fetched organization uses Azure as authentication system and no azure token is passed when initializing the SDK', async () => {
    const mockOrganization = {
      _id: 'myorg',
      name: 'Mock Rever Org',
      authenticationType: 'azure_active_directory',
    };

    jest.spyOn(axios, 'get').mockReturnValueOnce(
      Promise.resolve({
        data: mockOrganization,
      }),
    );

    const args = omit(baseArgs, 'azureStorageToken');

    await expect(init(args)).rejects.toThrow(
      '"azureStorageToken" param is required for organizations using Azure as authentication strategy',
    );
  });
});
