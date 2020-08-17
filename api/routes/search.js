const express = require('../node_modules/express');
const axios = require('../node_modules/axios').default;
const routes = express.Router();

const searchSpotifyByKeyword = async (req, res) => {
  let headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
  };

  if (req.query.search) {
    await axios.get("https://api.spotify.com/v1/search", {
        headers: headerOptions,
        params: {
          q: req.query.search,
          type: "album,track,artist",
          market: "from_token"
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

 }


routes.get("/api/search", searchSpotifyByKeyword);
   
module.exports = routes;