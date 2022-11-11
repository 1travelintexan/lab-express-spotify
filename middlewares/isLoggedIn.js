const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
};
const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/home");
  } else {
    next();
  }
};
module.exports = { isLoggedIn, isLoggedOut };
