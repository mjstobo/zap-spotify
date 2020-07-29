const express = require('express');
const axios = require('axios').default;
const routes = express.Router();
const checkAuth = require('../utils/checkAuth');


const getCurrentlyPlayingTrack = async (req, res) => {
   if (req.session) {
     let headerOptions = {
       Authorization: "Bearer " + req.session.access_token,
     };
     await axios
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
       .catch((e) => console.log(e.data));
   } else {
     res.status(400).send("User not logged in");
   }
 }


routes.get("/api/currently-playing", getCurrentlyPlayingTrack);
   
module.exports = routes;