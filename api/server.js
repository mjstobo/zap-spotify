//imports


import express from "./node_modules/express";
import cookieParser from "./node_modules/cookie-parser";
const dotenv = require("./node_modules/dotenv/config");
const cors = require("./node_modules/cors/lib");
const session = require("./node_modules/express-session");
const path = require('path');

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

const hour = 3600 * 1000;

const sessionData = {
  resave: true,
  name: "zap-session",
  saveUninitialized: true,
  rolling: true,
  secret: "archie-pug-tuck",
  cookie: { httpOnly: false, maxAge: hour }
}

//middlewares
api.use(session(sessionData))
  .use(cookieParser())
  .use(cors({ origin: "localhost:3000", credentials: false}))
  .use(express.static(path.join(__dirname, 'build')))
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
