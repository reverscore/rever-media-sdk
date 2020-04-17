import axios from 'axios';

import ReverMediaClient from './ReverMediaClient';
import ReverMediaError from './ReverMediaError';
import config from './config';

export default async function init(args = {}) {
  validateArgs(args);

  const organization = await fetchOrganizationData(args);

  validateOrganizationAuthArgs(organization, args);

  return new ReverMediaClient({ ...args, organization });
}

function validateArgs(args) {
  const { reverURL = '', reverToken = '', organizationId = '' } = args;

  if (!reverURL.trim()) throw new ReverMediaError('"reverURL" param is required');
  if (!reverToken.trim()) throw new ReverMediaError('"reverToken" param is required');
  if (!organizationId.trim()) throw new ReverMediaError('"organizationId" param is required');
}

async function fetchOrganizationData(args) {
  try {
    const { reverURL, reverToken, organizationId } = args;
    const requestURL = `${reverURL}/organizations/${organizationId}`;
    const response = await axios.get(requestURL, {
      headers: { Authorization: reverToken },
    });

    return response.data;
  } catch (err) {
    throw new Error(
      `An error occurred trying to get organization with id ${
        args.organizationId
      }.\nError: ${err?.message ?? 'No details.'}\nInit args: ${JSON.stringify(args)}`,
    );
  }
}

function validateOrganizationAuthArgs(organization, args) {
  const mediaProvider = organization?.mediaProvider ?? '';
  const azureStorageToken = args?.azureStorageToken;
  const organizationUsesAzureStorage = mediaProvider === config.mediaProviders.externalAzureStorage;

  if (organizationUsesAzureStorage && !azureStorageToken) {
    throw new ReverMediaError(
      '"azureStorageToken" param is required for organizations using Azure Storage as media provider',
    );
  }
}
