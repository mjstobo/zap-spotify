import express from 'express';
const axios = require('axios').default;
const routes = require('express').Router();

routes.get('/currently-playing', (req, res) => {

    let headerOptions = { Authorization: "Bearer " + req.cookies['spotifyAccess'] };
    axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: headerOptions,
      })
         .then(response => {
            let currentTrack = {
             trackName:   response.data.item.name,
             artistName:  response.data.item.artists.name
            }
            res.send(currentTrack);
         
         })
         .catch(e => console.log(e));

})

module.export = routes;