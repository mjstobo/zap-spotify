const express = require("express");
const { response } = require("express");
const axios = require("axios").default;
const routes = express.Router();

const getZapPlaylistFromList = async (playlistArray) => {
  let zapPlaylist = playlistArray.filter(
    (playlist) => playlist.name === "ZAP::Playlist"
  );
  return zapPlaylist ? zapPlaylist : false;
};

const createZapPlaylist = async (headerOptions, currUserId) => {
  return await axios
    .post(
      `https://api.spotify.com/v1/users/${currUserId}/playlists`,
      { name: "ZAP::Playlist" },
      { headers: headerOptions }
    )
    .then((response) => {
      return response.data;
    })
    .catch((e) => console.log(e));
};

const getPlaylists = async (req, res) => {
  const headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
  };

  let zapPlaylist;
  let currUserId = req.session.currentUser.id;
  let response = await axios.get("https://api.spotify.com/v1/me/playlists", { headers: headerOptions })
    .then((response) => {
      zapPlaylist = getZapPlaylistFromList(response.data.items);
      return zapPlaylist;
    })
    .catch((e) => console.log(e));
  
    if (response.length === 0) {
      console.log("Playlist doesn't exist. Creating new one");
      await createZapPlaylist(headerOptions, currUserId).then((p) => {
        console.log("Playlist created, responding.");
        res.json(p)
      });
    } else {
      res.json(response);
    }
  
};
routes.get("/api/playlists", getPlaylists);

module.exports = routes;
