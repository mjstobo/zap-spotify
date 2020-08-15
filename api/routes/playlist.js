const express = require("../node_modules/express");
const { response } = require("../node_modules/express");
const axios = require("../node_modules/axios").default;
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

const getTracks = async (playlistUrl, headerOptions) => {
  return await axios
    .get(playlistUrl, { headers: headerOptions })
    .then((response) => {
      return response.data.items;
    });
};

const removeTrackFromPlaylist = async (req, res) => {
  const headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
    "Content-Type": "application/json",
  };

  if (!req.query.playlist_id) {
    res.send("No playlist specified");
  }

  if (!req.query.track_id) {
    res.send("No track specified");
  }

  if (req.query.track_id && req.query.playlist_id) {
    let tracksArr = [];
    tracksArr.push({
      uri: req.query.track_id,
    });

    await axios
      .delete(
        `https://api.spotify.com/v1/playlists/${req.query.playlist_id}/tracks`,
        {
          headers: headerOptions,
          data: {
            tracks: tracksArr,
          },
        }
      )
      .then((response) => {
        res.status(200).json("Removed successfully");
      })
      .catch((e) => console.log(e.data));
  }
};

const getPlaylists = async (req, res) => {
  const headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
  };

  let zapPlaylist;
  let currUserId = req.session.currentUser.id;
  let existingPlaylist = await axios
    .get("https://api.spotify.com/v1/me/playlists", { headers: headerOptions })
    .then((response) => {
      zapPlaylist = getZapPlaylistFromList(response.data.items);
      return zapPlaylist;
    })
    .catch((e) => console.log(e));

  if (existingPlaylist.length === 0) {
    await createZapPlaylist(headerOptions, currUserId).then((newPlaylist) => {
      res.json(newPlaylist);
    });
  } else {
    await getTracks(existingPlaylist[0].tracks.href, headerOptions)
      .then((playlistTracks) => res.json({ existingPlaylist, playlistTracks }))
      .catch((e) => console.log(e));
  }
};

const addTrackToPlaylist = async (req, res) => {
  const headerOptions = {
    Authorization: "Bearer " + req.session.access_token,
    "Content-Type": "application/json",
  };

  if (!req.query.uris) {
    res.send("No track specified");
  }

  if (req.query.uris) {

    let trackArr = [];
    trackArr.push(req.query.uris);

    await axios
      .post(
        `https://api.spotify.com/v1/playlists/${req.query.playlist_id}/tracks`,
        { uris: trackArr },
        {
          headers: headerOptions,
        }
      )
      .then((response) => {
        res.status(200).json("Added successfully");
      })
      .catch((e) => console.log(e));
  }
};

routes.get("/api/remove-track", removeTrackFromPlaylist);
routes.get("/api/add-track", addTrackToPlaylist);
routes.get("/api/playlists", getPlaylists);

module.exports = routes;
