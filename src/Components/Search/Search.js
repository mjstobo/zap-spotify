import React from "react";
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
      searchValue: ""
    };
  }

   componentDidUpdate(prevProps) {
    if(prevProps.searchValue !== this.props.searchValue){
      this.setState({
        isLoaded: false
      })
      this.searchForTerm(this.props.searchValue)
    }
  }

  async componentDidMount() {
    await this.searchForTerm(this.props.searchValue)
  }

  searchForTerm = async (e) => {
     await axios
      .get(`/api/search?search=${e}`)
      .then(response => {
        if(response.status === 200){
        this.setState({
          searchValue: e,
          searchTracks: response.data.tracks.items,
          searchArtists: response.data.artists.items,
          searchAlbums: response.data.albums.items,
          isLoaded: true
        });
        this.generateResultsTiles(response.data.tracks.items);
      }
      })
      .catch((e) => console.log(e));
  };

  generateResultsTiles = (searchResults) => {
    let tilesList = searchResults.map((result, index) => (
      <SpotifyResultsTile key={index} result={result} playlistId={this.props.playlistMetadata.id}/>
    ));
    this.setState({
      resultsList: tilesList,
    });
  };

  render() {
    if (!this.state.isLoaded) {
      return (
      <div className="searching loader">
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>
      </div>
      );
    }
    return (
      <>
        {this.state.resultsList && <h4 className="search-summary">Spotify results for <span className="search-term">{this.state.searchValue}</span></h4>}
        <div className="search-results">
          {this.state.resultsList}
          </div>
      </>
    );
  }
}

export default Search;
