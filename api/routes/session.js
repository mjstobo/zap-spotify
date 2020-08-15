const express = require('../node_modules/express');
const axios = require('../node_modules/axios').default;
const routes = express.Router();
const checkAuth = require('../utils/checkAuth');


const getSession = async (req, res) => {
    let sess = req.session;
    if (sess) {
      //todo check it matches session data?
      let isLoggedIn = req.session.isSpotifyLoggedIn;
      let session_id = req.session.session_id;
      let resObj = {
        loggedIn: isLoggedIn,
        session_id: session_id,
      };
      res.status(200).json(resObj);
    }
  }


routes.get("/api/session", getSession);
   

 

module.exports = routes;