import axios from 'axios';

import ReverMedia from './ReverMedia';

export default async function init(args = {}) {
  validateArgs(args);

  const organization = await fetchOrganizationData(args);

  validateOrganizationAuthArgs(organization, args);

  return new ReverMedia({ ...args, organization });
}

function validateArgs(args) {
  const { reverURL = '', reverToken = '', organizationId = '' } = args;

  if (!reverURL.trim()) throw new Error('reverURL param is required');
  if (!reverToken.trim()) throw new Error('reverToken param is required');
  if (!organizationId.trim()) throw new Error('organizationId param is required');
}

async function fetchOrganizationData(args) {
  try {
    const { reverURL, reverToken, organizationId } = args;
    const requestURL = `${reverURL}/organizations/${organizationId}`;
    const response = await axios.get(requestURL, {
      headers: { Authorization: reverToken },
    });

    return response.data;
  } catch {
    throw new Error(
      `An error ocurred trying to get organization with id ${
        args.organizationId
      }.\nInit args: ${JSON.stringify(args)}`,
    );
  }
}

function validateOrganizationAuthArgs(organization, args) {
  const authenticationType = organization?.authenticationType ?? '';
  const azureToken = args?.azureToken;
  const organizationUsesAzureAuth = authenticationType.includes('azure');

  if (organizationUsesAzureAuth && !azureToken) {
    throw new Error(
      'azureToken param is required for organizations using Azure as authentication strategy',
    );
  }
}
