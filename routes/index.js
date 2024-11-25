const express = require('express');
const { createPlayboardRedeemUrl } = require('./lib/playboard-integration');

const router = express.Router();

async function ensureUserAuthorized(req) {
  return true;
}

/*
 * GET home page.
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
 * Choice 1: Redeem via redirect (Can't be used via API)
 */
router.get('/redeem', async function(req, res, next) {
  await ensureUserAuthorized(req);

  const redeemUrl = await createPlayboardRedeemUrl({
    // TODO: Replace with your service name that given from Playboard team
    iss: 'sample-provider',
    // TODO: Replace with user ID
    userRefCode: 'user-123',
    // TODO: Replace with user display name
    userDisplayName: 'John Doe',
    // TODO: Replace with ticket ID or event ID (to be discuss)
    redeemCode: 'REDEEM-123',
  });
  res.redirect(307, redeemUrl);
});

/*
 * Alternative of choice 1 that use callback instead of async/await
 */
/*
router.get('/redeem', function(req, res, next) {
  ensureUserAuthorized(req)
    .then(() => {
      return createPlayboardRedeemUrl({
        // TODO: Replace with your service name that given from Playboard team
        iss: 'sample-provider',
        // TODO: Replace with user ID
        userRefCode: 'user-123',
        // TODO: Replace with user display name
        userDisplayName: 'John Doe',
        // TODO: Replace with ticket ID or event ID (to be discuss)
        redeemCode: 'REDEEM-123',
      })
    })
    .then((redeemUrl) => {
      res.redirect(307, redeemUrl);
    });
});
*/

/*
 * Choice 2: Redeem via API (Frontend have to handle redirects)
 */
router.get('/api/redeem', async function(req, res, next) {
  await ensureUserAuthorized(req);

  const redeemUrl = await createPlayboardRedeemUrl({
    // TODO: Replace with your service name that given from Playboard team
    iss: 'sample-provider',
    // TODO: Replace with user ID
    userRefCode: 'user-123',
    // TODO: Replace with user display name
    userDisplayName: 'John Doe',
    // TODO: Replace with ticket ID or event ID (to be discuss)
    redeemCode: 'REDEEM-123',
  });
  res.json({
    url: redeemUrl
  });
});

/*
 * Alternative of choice 2 that use callback instead of async/await
 */
/*
router.get('/api/redeem', async function(req, res, next) {
  ensureUserAuthorized(req)
    .then(() => {
      return createPlayboardRedeemUrl({
        // TODO: Replace with your service name that given from Playboard team
        iss: 'sample-provider',
        // TODO: Replace with user ID
        userRefCode: 'user-123',
        // TODO: Replace with user display name
        userDisplayName: 'John Doe',
        // TODO: Replace with ticket ID or event ID (to be discuss)
        redeemCode: 'REDEEM-123',
      })
    })
    .then((redeemUrl) => {
      res.json({
        url: redeemUrl
      });
    });
});
*/

module.exports = router;
