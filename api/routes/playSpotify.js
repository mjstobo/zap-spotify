  const express = require('../node_modules/express');
  const axios = require('../node_modules/axios').default;
  const routes = express.Router();
  
  
  const playSpotifyTrack = async (req, res) => {
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
    .catch(e => res.status(e.response.data.error.status).send());
  } else {
    res.status(400).send('URI not provided');
  }
   }
  
  
  routes.get("/api/play", playSpotifyTrack);
     
  module.exports = routes;