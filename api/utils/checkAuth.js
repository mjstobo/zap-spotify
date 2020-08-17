const querystring = require("querystring");
const axios = require("../node_modules/axios")

const checkAuth = (req, res, next) => {
  const isAppAuthenticated = req.session.access_token;

  if (isAppAuthenticated) {
    if (Date.now() - req.session.spotifyTokenExpiryTime > 0) {
      let sessionData = refreshAccessToken(req).then(() => {
        req.session.access_token = sessionData.access_token;
        req.session.refresh_token = sessionData.refresh_token;
        req.session.auth_code = sessionData.authCode;
        req.session.save();
        next();
      });
    } else {
      next();
    }
  } else {
      res.redirect(401, "/#/login");
  }
};

const refreshAccessToken = async (req) => {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_CALLBACK_URI;

  const header = new Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    data: querystring.stringify({
      code: req.session.authCode,
      redirect_uri: redirect_uri,
      grant_type: "refresh_token",
      refresh_token: req.session.refresh_token,
    }),
    headers: {
      Authorization: "Basic " + header,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  let sessionData = await axios(authOptions).then((response) => {
    let access_token = response.data.access_token,
      refresh_token = response.data.refresh_token,
      headerOptions = { Authorization: "Bearer " + access_token };
    return {
      access_token: access_token,
      refresh_token: refresh_token,
      headerOptions: headerOptions,
      authCode: req.query.code,
    };
  });

  return sessionData;
};

module.exports = checkAuth;
