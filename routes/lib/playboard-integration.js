const fs = require('fs/promises');
const { createSigner } = require('fast-jwt');
const assert = require('assert');

const magicLinkOptions = {
  // Private key used to sign the token
  // TODO: Change this path to your own private key
  magicLinkPrivateKeyPath: './resources/es-256-private.key',
  magicLinkPrivateKeyAlgorithm: 'ES256',
  magicLinkBaseUrl: 'https://www.playboard.cloud/magic-redeem',
  magicLinkAgeInMs: 60000,
}

let signTokenInitialized = false;
let signToken = () => {
  throw new Error('signToken is not initialized');
}

function ensureSignTokenInitialized() {
  if (signTokenInitialized) {
    return;
  }

  assert(magicLinkOptions.magicLinkPrivateKeyPath, 'magicLinkPrivateKeyPath is required');
  assert(magicLinkOptions.magicLinkPrivateKeyAlgorithm, 'magicLmagicLinkPrivateKeyAlgorithminkPrivateKeyPath is required');
  assert(magicLinkOptions.magicLinkBaseUrl, 'magicLinkBaseUrl is required');
  assert(magicLinkOptions.magicLinkAgeInMs, 'magicLinkAgeInMs is required');

  signToken = createSigner({
    key: async () => fs.readFile(magicLinkOptions.magicLinkPrivateKeyPath),
    algorithm: magicLinkOptions.magicLinkPrivateKeyAlgorithm,
    expiresIn: magicLinkOptions.magicLinkAgeInMs,
  });
}

async function createPlayboardRedeemToken(params = {}) {
  assert(params.iss, 'iss (3rd-party service name) is required');
  assert(params.userRefCode, 'userRefCode is required');
  assert(params.userDisplayName, 'userDisplayName is required');
  assert(params.redeemCode, 'redeemCode is required');

  const token = await signToken({
    iss: params.iss,
    userRefCode: params.userRefCode,
    userDisplayName: params.userDisplayName,
    redeemCode: params.redeemCode,
  });

  return token;
};

async function createPlayboardRedeemUrl(params = {}) {
  ensureSignTokenInitialized();

  const token = await createPlayboardRedeemToken(params);
  return `${magicLinkOptions.magicLinkBaseUrl}?token=${token}`;
}

module.exports = {
  createPlayboardRedeemUrl,
};
