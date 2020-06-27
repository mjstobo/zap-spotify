import React from "react";
import "./Search.css";
import axios from "axios";
import ResultsTile from "../Results/ResultsTile";

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

  handleSearchSubmit = (e) => {
     axios
      .get(`/api/search?search=${this.state.searchValue}`)
      .then((response) => {
        this.setState({
          searchTracks: response.data.tracks.items,
          searchArtists: response.data.artists.items,
          searchAlbums: response.data.albums.items,
        });
        this.generateResultsTiles(response.data.tracks.items);
      })
      .catch((e) => console.log(e));
  };

  generateResultsTiles = (searchResults) => {
    console.log(searchResults);
    let tilesList = searchResults.map((result, index) => (
      <ResultsTile key={index} result={result} />
    ));
    this.setState({
      resultsList: tilesList,
    });
  };

  handleSearchInputChange = (e) => {
    console.log(e.target.value);
    this.setState({ searchValue: e.target.value });
  };

  render() {
    return (
      <>
        <form className="search-frame">
          <h1>Search!</h1>
          <div className="search-component">
            <input
              type="text"
              className="search-bar"
              label="Search for songs, albums, artists"
              value={this.state.value}
              onChange={this.handleSearchInputChange}
            />
            <input
              type="submit"
              className="search-bar-submit"
              onClick={this.handleSearchSubmit}
              value=">>"
            />
          </div>
        </form>
        <div className="search-results">{this.state.resultsList}</div>
      </>
    );
  }
}

export default Search;
