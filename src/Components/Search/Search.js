import React from "react";
import './Search.css'
import axios from "axios";
import ResultsTile from '../Results/ResultsTile';

class Search extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      searchTracks: null,
      searchArtists: null,
      searchAlbums: null,
      resultsList: null
    }
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchSubmit = (e) => {
    axios.get(`/api/search?search=${this.state.searchValue}`)
    .then(response => {
      this.setState({
        searchTracks: response.data.tracks.items,
        searchArtists: response.data.artists.items,
        searchAlbums: response.data.albums.items,
        resultsList: this.generateResultsTiles(response.data.tracks.items)
      })
    })
    .catch(e => console.log(e));
  }

  generateResultsTiles = (searchResults) => {
    let tilesList = searchResults.map(result => { return <ResultsTile key={result.name} result={result}/>})
    return tilesList;
  }

  handleSearchInputChange = (e) => {
    this.setState({searchValue: e.target.value});
  }

  render() {
    return (
      <form className="search-frame">
        <h1>Search!</h1>
        <div className="search-component">
        <input type="text" className="search-bar" label="Search for songs, albums, artists" value={this.state.value} onChange={this.handleSearchInputChange} />
          <input type="submit" className="search-bar-submit" onClick={this.handleSearchSubmit} value=">>" />
          {this.state.resultsList}
        </div>
      </form>
    );
  }
}

export default Search;