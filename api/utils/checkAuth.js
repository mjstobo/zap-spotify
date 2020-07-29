const checkAuth = (req, res, next) => {
    const isSpotifyAuthenticated = req.session.isSpotifyLoggedIn;
    const isAppAuthenticated = req.session.access_token;
    if(isSpotifyAuthenticated && isAppAuthenticated) {
      next();
    } else {
      res.status(401).send("Invalid user")
    } 
}

module.exports = checkAuth