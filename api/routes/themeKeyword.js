const express = require('express');
const axios = require('axios').default;
const routes = express.Router();

const getThemeKeyword = async (req, res) => {
    let searchTerm = req.query.search;
    if(searchTerm) {
      await axios.get('http://api.datamuse.com/words', {
        params: {
          ml: searchTerm,
          max: 25
        }
      })
      .then(response => res.status(200).json(response.data))
      .catch(e => console.log(e));
    }
 }


routes.get("/api/theme-keyword", getThemeKeyword);
   
module.exports = routes;