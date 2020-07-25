import React from "react";
import axios from 'axios'
import './ResultsTile.css';
import SpotifyResultsTile from './SpotifyResultsTile'

class KeywordResultsTile extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = async () => {
    await axios
      .get(`${process.env.REACT_APP_ENDPOINT}/api/search?search=${this.props.result.word}`)
      .then(response => {
        this.setState({
          searchTracks: response.data.tracks.items,
          searchArtists: response.data.artists.items,
          searchAlbums: response.data.albums.items,
        });
        this.generateResultsTiles(response.data.tracks.items);
      })
      .catch((e) => console.log(e));
  }

  generateResultsTiles = (searchResults) => {
    let tilesList = searchResults.map((result, index) => (
      <SpotifyResultsTile key={index} result={result} type='subresult' />
    ));
    this.setState({
      resultsList: tilesList,
    });
  };

  render() {
    return (
        <>
        <div className="results-tile keyword">
          <div className="results-tile-content">
            <h4 className="results-heading">{this.props.result.word}</h4>
          </div>
          <button className="play-uri-btn" onClick={this.handleClick}>Search Spotify</button> 
          </div>
          <div className="keyword-subresults">
            {this.state.resultsList}
          </div>
          </>
    );
  }
}

export default KeywordResultsTile;
