import React from "react";
import "../Search/Search.css";
import "./ThemedSearch.css"
import axios from 'axios'
import ResultsTile from '../Results/ResultsTile'


class ThemedSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    handleSearchSubmit = async () => {
        await axios
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
       let tilesList = searchResults.map((result, index) => (
         <ResultsTile key={index} result={result} />
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
        <h1>Theme Search</h1>
        <p>Enter a theme keyword, such as 'Weather', and see spotify results and related keyword suggestions!</p>
        <div className="search-component">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for songs, albums, artists"
            value={this.state.searchValue}
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
      <div className="search-results theme">
      <p> Spotify results</p>
      {this.state.resultsList}
      </div>
      </>
    );
  }
}

export default ThemedSearch;
