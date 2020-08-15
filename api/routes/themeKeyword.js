const express = require("../node_modules/express");
const { response } = require("../node_modules/express");
const axios = require("../node_modules/axios").default;
const routes = express.Router();

const returnWordsFromResponse = (responseData) => {
  return responseData.data.map((data) => data.word);
};

const getThemeKeyword = async (req, res) => {
  let searchTerm = req.query.search;

  if (searchTerm) {
    const synonyms = axios.get("http://api.datamuse.com/words", {
      params: {
        rel_syn: searchTerm,
        max: 15,
      },
    });

    const relatedWords = axios.get("http://api.datamuse.com/words", {
      params: {
        ml: searchTerm,
        max: 10,
      },
    });

    const nounWords = axios.get("http://api.datamuse.com/words", {
      params: {
        rel_jja: searchTerm,
        max: 5,
      },
    });

    const triggerWords = axios.get("http://api.datamuse.com/words", {
      params: {
        rel_trg: searchTerm,
        max: 5,
      },
    });

    await axios
      .all([synonyms, relatedWords, nounWords, triggerWords])
      .then(
        axios.spread((...responses) => {
          const synonymsResponse = responses[0];
          const relatedWordsResponse = responses[1];
          const adjWordsResponse = responses[2];
          const trgWordsResponse = responses[2];

          const mergedData = [
            ...returnWordsFromResponse(synonymsResponse),
            ...returnWordsFromResponse(relatedWordsResponse),
            ...returnWordsFromResponse(adjWordsResponse),
            ...returnWordsFromResponse(trgWordsResponse)
          ];
          const dataToReturn = [...new Set(mergedData)];

          res.status(200).json(dataToReturn);
        })
      )
      .catch((e) => console.log(e));
  }
};

routes.get("/api/theme-keyword", getThemeKeyword);

module.exports = routes;
