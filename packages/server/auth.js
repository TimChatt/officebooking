// Temporary stub; remove when JWT auth is re-enabled
function checkJwt(req, res, next) {
  next();
}

module.exports = { checkJwt };
