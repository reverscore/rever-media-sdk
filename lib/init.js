import axios from 'axios';

import ReverMedia from './ReverMedia';

export default async function init(args = {}) {
  validateArgs(args);

  const organization = await fetchOrganizationData(args);

  const reverMediaInstance = new ReverMedia({ ...args, organization });
  return reverMediaInstance;
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
      `An error ocurred triying to get organization with id ${
        args.organizationId
      }.\nInit args: ${JSON.stringify(args)}`,
    );
  }
}
