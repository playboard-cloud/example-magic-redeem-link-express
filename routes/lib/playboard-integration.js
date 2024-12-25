const fs = require('fs/promises');
const { createSigner } = require('fast-jwt');
const assert = require('assert');
const { options } = require('..');

const magicRedeemLinkOptions = {
  // Private key used to sign the token
  // TODO: Change this path to your own private key
  magicRedeemLinkPrivateKeyPath: './resources/es-256-private.key',
  magicRedeemLinkPrivateKeyAlgorithm: 'ES256',
  // TODO: Replace with the link you got from Playboard team
  magicRedeemLinkBaseUrl: 'https://www.playboard.cloud/sample-service/magic-redeem',
  magicRedeemLinkAgeInMs: 60000,
}

let signTokenInitialized = false;
let signToken = () => {
  throw new Error('signToken is not initialized');
}

function ensureSignTokenInitialized() {
  if (signTokenInitialized) {
    return;
  }

  assert(magicRedeemLinkOptions.magicRedeemLinkPrivateKeyPath, 'magicRedeemLinkPrivateKeyPath is required');
  assert(magicRedeemLinkOptions.magicRedeemLinkPrivateKeyAlgorithm, 'magicRedeemLinkPrivateKeyAlgorithm is required');
  assert(magicRedeemLinkOptions.magicRedeemLinkBaseUrl, 'magicRedeemLinkBaseUrl is required');
  assert(magicRedeemLinkOptions.magicRedeemLinkAgeInMs, 'magicRedeemLinkAgeInMs is required');

  signToken = createSigner({
    key: async () => fs.readFile(magicRedeemLinkOptions.magicRedeemLinkPrivateKeyPath),
    algorithm: magicRedeemLinkOptions.magicRedeemLinkPrivateKeyAlgorithm,
    expiresIn: magicRedeemLinkOptions.magicRedeemLinkAgeInMs,
  });
}

async function createPlayboardMagicRedeemToken(params = {}) {
  assert(params.userRefCode, 'userRefCode is required');
  assert(params.userDisplayName, 'userDisplayName is required');
  assert(params.redeemCode, 'redeemCode is required');

  const token = await signToken({
    userRefCode: params.userRefCode,
    userDisplayName: params.userDisplayName,
    redeemCode: params.redeemCode,
    userMeta: {
      ...(params.userMeta ?? {})
    },
    customMeta: {
      ...(params.customMeta ?? {})
    }
  });

  return token;
};

async function createPlayboardMagicRedeemLinkUrl(params = {}) {
  ensureSignTokenInitialized();

  const token = await createPlayboardMagicRedeemToken(params);
  return `${magicRedeemLinkOptions.magicRedeemLinkBaseUrl}?token=${token}`;
}

module.exports = {
  createPlayboardMagicRedeemLinkUrl,
};
