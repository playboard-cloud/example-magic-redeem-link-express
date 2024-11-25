const express = require('express');
const { createPlayboardMagicRedeemLinkUrl } = require('./lib/playboard-integration');

const router = express.Router();

async function ensureUserAuthorizedAndMakeMagicRedeemLinkParams(req, eventId) {
  return {
    // TODO: Replace with user ID
    userRefCode: 'user-123',
    // TODO: Replace with user display name
    userDisplayName: 'John Doe',
    // TODO: Replace with ticket ID or event ID (to be discuss)
    redeemCode: eventId,
  };
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
router.get('/events/:eventId/watch', async function(req, res, next) {
  const magicRedeemLinkParams = await ensureUserAuthorizedAndMakeMagicRedeemLinkParams(req, req.params.eventId);
  const magicRedeemLinkUrl = await createPlayboardMagicRedeemLinkUrl(magicRedeemLinkParams);
  res.redirect(307, magicRedeemLinkUrl);
});

/*
 * Alternative of choice 1 that use callback instead of async/await
 */
/*
router.get('/events/:eventId/watch', function(req, res, next) {
  ensureUserAuthorizedAndMakeMagicRedeemLinkParams(req, req.params.eventId)
    .then(createPlayboardMagicRedeemLinkUrl)
    .then((magicRedeemLinkUrl) => {
      res.redirect(307, magicRedeemLinkUrl);
    });
});
*/

/*
 * Choice 2: Redeem via API (Frontend have to handle redirects)
 */
router.get('/api/events/:eventId/actions/create-watch-link', async function(req, res, next) {
  const magicRedeemLinkParams = await ensureUserAuthorizedAndMakeMagicRedeemLinkParams(req, req.params.eventId);
  const magicRedeemLinkUrl = await createPlayboardMagicRedeemLinkUrl(magicRedeemLinkParams);
  res.json({
    url: magicRedeemLinkUrl
  });
});

/*
 * Alternative of choice 2 that use callback instead of async/await
 */
/*
router.get('/api/events/:eventId/actions/create-watch-link', async function(req, res, next) {
  ensureUserAuthorizedAndMakeMagicRedeemLinkParams(req, req.params.eventId)
    .then(createPlayboardMagicRedeemLinkUrl)
    .then((magicRedeemLinkUrl) => {
      res.json({
        url: magicRedeemLinkUrl
      });
    });
});
*/

module.exports = router;
