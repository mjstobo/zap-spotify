//imports

const express = require("express")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv/config");
const cors = require("cors/lib");
const redis = require('redis');
const session = require("express-session");
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()
const path = require("path");

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
const checkAuth = require("./utils/checkAuth");

const hour = 3600 * 1000;

const sessionData = {
  store: 
  process.env.NODE_ENV === "production" ? 
  new RedisStore({
    url: process.env.REDIS_URL,
    client: redisClient
  })
  : null,
  resave: true,
  name: "zap-session",
  saveUninitialized: true,
  rolling: true,
  secret: "archie-pug-tuck",
  cookie: { httpOnly: false, maxAge: hour },
};

//middlewares
api
  .use(session(sessionData))
  .use(cookieParser())
  .use(cors({ origin: "localhost:5000", credentials: false }))
  .use(express.static(path.join(__dirname, "../build")))
  .use(express.json());

api.use("/", loginToSpotify);
api.use("/", spotifyCallback);
api.use("/", checkAuth, getCurrentlyPlayingTrack);
api.use("/", express.json(), getSession);
api.use("/", checkAuth, searchSpotifyByKeyword);
api.use("/", checkAuth, playSpotifyTrack);
api.use("/", checkAuth, express.json(), getThemeKeyword);
api.use("/", checkAuth, getPlaylists);

api.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "../build/index.html"));
});

// run app
api.listen(process.env.PORT || 5000)
console.log("API running " + process.env.PORT);
