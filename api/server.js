//imports

import dotenv from "dotenv/config";
import express, { response } from "express";
import cookieParser from "cookie-parser";
const cors = require("cors");
const session = require("express-session");

//express init
const api = express();

//routes import
const loginToSpotify = require("./routes/login");
const spotifyCallback = require("./routes/login");
const getCurrentlyPlayingTrack = require("./routes/currentlyPlaying");
const getSession = require("./routes/session");
const searchSpotifyByKeyword = require("./routes/search");
const playSpotifyTrack = require("./routes/playSpotify");
const getThemeKeyword = require("./routes/themeKeyword");
const getPlaylists = require("./routes/playlist");

//validate spotify access
const checkAuth = require('./utils/checkAuth');

const sessionData = {
  resave: true,
  name: "zap-session",
  saveUninitialized: true,
  secret: "archie-pug-tuck",
  cookie: { httpOnly: false }
}

//middlewares
api.use(session(sessionData))
  .use(cookieParser())
  .use(cors({ origin: "localhost:3000", credentials: false}))
  .use(express.json());

api.use("/", loginToSpotify);
api.use("/", spotifyCallback);
api.use("/", checkAuth, getCurrentlyPlayingTrack);
api.use("/", checkAuth, express.json(), getSession);
api.use("/", checkAuth, searchSpotifyByKeyword);
api.use("/", checkAuth, playSpotifyTrack);
api.use("/", checkAuth, express.json(), getThemeKeyword);
api.use("/", checkAuth, getPlaylists)

// run app
api.listen(process.env.DEFAULT_PORT);
console.log("API running " + process.env.DEFAULT_PORT);
