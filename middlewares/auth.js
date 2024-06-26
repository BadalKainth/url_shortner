const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
  const uidValue = req.cookies.uid;
  req.user = null;

  if (!uidValue) {
    return next();
  }

  const token = req.cookies.uid;
  const user = getUser(token);

  req.user = user;
  return next();
}
function restrictTo(roles) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");

    if (!roles.includes(req.user.role)) return res.end("UnAuthorized!");

    return next();
  };
}

module.exports = {
  checkForAuthentication,
  restrictTo,
};
