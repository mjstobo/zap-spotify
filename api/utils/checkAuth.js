const checkAuth = (req, res, next) => {
    const isSpotifyAuthenticated = req.session.isSpotifyLoggedIn;
    const isAppAuthenticated = req.session.access_token;
    if(isSpotifyAuthenticated && isAppAuthenticated) {
      next();
    } else {
      req.session.destroy(); 
      res.redirect(401, "/#/login");
    } 
}

module.exports = checkAuth 