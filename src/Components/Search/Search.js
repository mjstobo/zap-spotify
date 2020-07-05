import React from "react";
import "./Search.css";
import axios from "axios";
import SpotifyResultsTile from "../Results/SpotifyResultsTile";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTracks: "",
      searchArtists: "",
      searchAlbums: "",
      resultsList: "",
      searchValue: "",
    };
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchSubmit = async (event) => {
    event.preventDefault();
     await axios
      .get(`/api/search?search=${this.state.searchValue}`)
      .then(response => {
        if(response.status === 200){
        this.setState({
          searchTracks: response.data.tracks.items,
          searchArtists: response.data.artists.items,
          searchAlbums: response.data.albums.items,
        });
        this.generateResultsTiles(response.data.tracks.items);
      }
      })
      .catch((e) => console.log(e));
  };

  generateResultsTiles = (searchResults) => {
    let tilesList = searchResults.map((result, index) => (
      <SpotifyResultsTile key={index} result={result} />
    ));
    this.setState({
      resultsList: tilesList,
    });
  };

  handleSearchInputChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  render() {
    return (
      <>
        <form className="search-frame">
          <h1>Search Spotify</h1>
          <div className="search-component">
            <input
              type="text"
              className="search-bar"
              placeholder="Search for songs, albums, artists"
              value={this.state.value}
              onChange={this.handleSearchInputChange}
            />
            <input
              type="submit"
              className="search-bar-submit"
              onClick={async (e) => {await this.handleSearchSubmit(e)}}
              value=">>"
            />
          </div>
        </form>
        <div className="search-results">
          {this.state.resultsList}
          </div>
      </>
    );
  }
}

export default Search;
