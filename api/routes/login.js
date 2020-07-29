const express = require("express");
const axios = require("axios").default;
const routes = express.Router();
import { v4 as uuidv4 } from "uuid";
import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/api/callback";

//constants
const stateKey = "spotify_auth_state";

const getUser = (headerOptions) => {
  axios
    .get("https://api.spotify.com/v1/me", {
      headers: headerOptions,
    })
    .then((response) => {
      return response;
    })
    .catch((e) => console.log(e));
};

const loginToSpotify = (req, res) => {
  const state = uuidv4();
  res.cookie(stateKey, state);

  const scope =
    "user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state";
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

const spotifyCallback = (req, res) => {
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state != storedState || state === null) {
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

    axios(authOptions)
      .catch((e) => {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      })
      .then((response) => {
        let access_token = response.data.access_token,
          refresh_token = response.data.refresh_token,
          headerOptions = { Authorization: "Bearer " + access_token };

        const userDetails = getUser(headerOptions);
        req.session.currentUser = userDetails;
        req.session.isSpotifyLoggedIn = true;
        req.session.access_token = access_token;
        req.session.session_id = uuidv4();
        req.session.save(() => {
          res.redirect("/#");
        });
      });
  }
};

routes.get("/api/login", loginToSpotify);
routes.get("/api/callback", spotifyCallback);

module.exports = routes;
