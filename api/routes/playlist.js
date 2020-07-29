const express = require('express');
const axios = require('axios').default;
const routes = express.Router();

const getPlaylists = async (req, res) => {
  let headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
  };

  await axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: headerOptions
      })
      .then(response => {
        console.log(response.data.items[0])
      })
      .catch((e) => console.log(e));
  }

routes.get("/api/playlists", getPlaylists);
   
module.exports = routes;