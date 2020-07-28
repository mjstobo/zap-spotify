//imports

import dotenv from "dotenv/config";
import express, { response } from "express";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import querystring from "querystring";

const axios = require("axios").default;
const cors = require("cors");
const session = require("express-session");

//express init
const api = express();
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/api/callback";

//routes import

const getCurrentlyPlayingTrack = require("./routes/currentlyPlaying")
const getSession = require('./routes/session')

//validate spotify access

const checkAuth = (req, res, next) => {
    const isSpotifyAuthenticated = req.session.isSpotifyLoggedIn;
    const isAppAuthenticated = req.session.access_token;
    if(isSpotifyAuthenticated && isAppAuthenticated) {
      next();
    } else {
      res.status(401).send("Invalid user")
    } 
}

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

//constants
const stateKey = "spotify_auth_state";


//functions 

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


//routes
api.get("/api/login", (req, res) => {
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
});

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

api.use("/", checkAuth, getCurrentlyPlayingTrack);

api.use("/", checkAuth, express.json(), getSession);

api.get("/api/search", checkAuth, async (req, res) => {
  let headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
  };

  if (req.query.search) {
    console.log(req.query.search);
    await axios.get("https://api.spotify.com/v1/search", {
        headers: headerOptions,
        params: {
          q: req.query.search,
          type: "album,track,artist"
        }
      })
      .then(response => {
        res.json({
          tracks: response.data.tracks,
          artists: response.data.artists,
          albums: response.data.albums
        });
      })
      .catch((e) => console.log(e));
  }
});

api.get('/api/play', checkAuth, async (req, res) => {
  let headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
  };
  if(req.query.uri) {
    await axios.put('https://api.spotify.com/v1/me/player/play', {
      uris: [req.query.uri]
    }, {
      headers: headerOptions
    })
    .then(response => res.status(204).send())
    .catch(e => console.log(e.response.data));
  } else {
    res.status(400).send('URI not provided');
  }
});

api.get('/api/theme-keyword', checkAuth, express.json(), async (req, res) => {
  let searchTerm = req.query.search;
  if(searchTerm) {
    await axios.get('http://api.datamuse.com/words', {
      params: {
        ml: searchTerm,
        max: 25
      }
    })
    .then(response => res.status(200).json(response.data))
    .catch(e => console.log(e));
  }
})

api.listen(process.env.DEFAULT_PORT);
console.log("API running " + process.env.DEFAULT_PORT);
