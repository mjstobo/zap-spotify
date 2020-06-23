//imports

import dotenv from "dotenv/config";
import express, { response } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import querystring from "querystring";

const bodyParser = require("body-parser");
const axios = require("axios").default;
const path = require("path");
const cors = require("cors");
const session = require("express-session");

//express init
const api = express();
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/api/callback";

//middlewares
api
  .use(
    session({
      resave: false,
      name: "zap-session",
      saveUninitialized: true,
      secret: "archie-pug",
      cookie: { httpOnly: false },
    })
  )
  .use(cookieParser())
  .use(
    cors({
      origin: "localhost:3000",
      credentials: false,
    })
  )
  .use(express.json());

//db init
mongoose.connect(process.env.MONGOOSE_DB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("db connected");
});

//constants
const stateKey = "spotify_auth_state";

//validate spotify access

//routes
api.get("/api/login", (req, res) => {
  const state = uuidv4();
  res.cookie(stateKey, state);

  const scope =
    "user-read-private user-read-email user-read-currently-playing user-read-playback-state";
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
});

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

api.get("/api/callback", (req, res) => {
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
});

api.get("/api/currently-playing", (req, res) => {
  if (req.session) {
    let headerOptions = {
      Authorization: "Bearer " + req.session.access_token,
    };
    axios
      .get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: headerOptions,
      })
      .then((response) => {
        if (!response.data) {
          res.status(400).send(false);
        } else {
          let currentTrack = {
            songName: response.data.item.name,
            artistName: response.data.item.artists[0].name,
          };
          res.send(currentTrack);
        }
      })
      .catch((e) => console.log(e));
  } else {
    res.status(400).send("User not logged in");
  }
});

api.get("/api/session", express.json(), (req, res) => {
  let sess = req.session;
  if (sess) {
    //todo check it matches session data?
    let isLoggedIn = req.session.isSpotifyLoggedIn;
    let session_id = req.session.session_id;
    let resObj = {
      loggedIn: isLoggedIn,
      session_id: session_id,
    };
    res.status(200).json(resObj);
  }
});

api.get("/api/search", (req, res) => {
  let headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
  };

  console.log(req.session.access_token);
  if (req.query.search) {
    console.log(req.query.search);
    axios
      .get("https://api.spotify.com/v1/search", {
        headers: headerOptions,
        params: {
          q: req.query.search,
          type: "album,track,artist"
        }
      })
      .then((response) => {
        res.json({
          tracks: response.data.tracks,
          artists: response.data.artists,
          albums: response.data.albums
        });
      })
      .catch((e) => console.log(e));
  }
});

api.listen(process.env.DEFAULT_PORT);
console.log("API running " + process.env.DEFAULT_PORT);
