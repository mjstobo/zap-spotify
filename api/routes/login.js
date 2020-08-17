const { uuid } = require('uuidv4');
const querystring = require("querystring");
const express = require("../node_modules/express");
const axios = require("../node_modules/axios").default;
const routes = express.Router();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_CALLBACK_URI;

//constants
const stateKey = "spotify_auth_state";

const getUser = async (headerOptions) => {
   let user = await axios
    .get("https://api.spotify.com/v1/me", {
      headers: headerOptions,
    })
    .then((response) => {
      let currUser = response.data;
      return currUser;
    })
    .catch((e) => console.log(e));
    return user;
};

const loginToSpotify = (req, res) => {
  const state = uuid();
  res.cookie(stateKey, state);

  const scope =
    "user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state playlist-modify-public";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
};

const spotifyCallback = async (req, res) => {
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state !== storedState || state === null) {
    res.redirect("/#error");
  } else {
    res.clearCookie(stateKey);
    const header = new Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64"
    );

    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      method: "post",
      data: querystring.stringify({
        code: req.query.code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
      headers: {
        Authorization: "Basic " + header,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    let sessionData = await axios(authOptions)
      .catch((e) => {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      })
      .then((response) => {
        console.log(response.data)
        let access_token = response.data.access_token,
          refresh_token = response.data.refresh_token,
          headerOptions = { Authorization: "Bearer " + access_token };
          return {access_token: access_token, refresh_token: refresh_token, headerOptions: headerOptions, authCode: req.query.code};
      });

      if(sessionData.access_token){
        await getUser(sessionData.headerOptions).then((currentUser) => {
          req.session.isSpotifyLoggedIn = true;
          req.session.access_token = sessionData.access_token;
          req.session.refresh_token = sessionData.refresh_token;
          req.session.spotifyTokenExpiryTime = Date.now() + (3600 * 1000);
          console.log(req.session.spotifyTokenExpiryTime);
          req.session.session_id = uuidv4();
          req.session.currentUser = currentUser;
          req.session.auth_code = sessionData.authCode;
          req.session.save(() => {
          res.redirect("/#");
        });
        })
      }
  }
};

routes.get("/api/login", loginToSpotify);
routes.get("/api/callback", spotifyCallback);

module.exports = routes;
