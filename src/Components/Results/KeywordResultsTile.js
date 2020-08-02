import React from "react";
import axios from 'axios'
import './ResultsTile.css';
import ResultsPanel from './ResultsPanel';
import upSvg from '../../up.svg'
import downSvg from '../../down.svg'

class KeywordResultsTile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchTracks: [],
      showResults: true,
      hasSearchedSpotify: false
    }
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
          hasSearchedSpotify: true
        });
      })
      .catch((e) => console.log(e));
  }

  handleListClick = () => {
    this.setState({
      showResults: !this.state.showResults
    })
  }

  render() {
    return (
        <>
        <div className="results-tile keyword">
          <div className="results-tile-content">
            <h4 className="results-heading">{this.props.result.word}</h4>
          </div>
          {!this.state.hasSearchedSpotify &&<button className="play-uri-btn" onClick={this.handleClick}>Search Spotify</button>}
          {this.state.hasSearchedSpotify && 
          
           <button className="play-uri-btn" onClick={this.handleListClick}>
               <img className="chevron-svg" alt="Open / Close results accordion" src={this.state.showResults ? upSvg : downSvg}/>
            </button>} 
          </div>
          <ResultsPanel result={this.state.searchTracks} showResults={this.state.showResults}/>
          </>
    );
  }
}

export default KeywordResultsTile;
