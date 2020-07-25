import React from "react";
import "../Search/Search.css";
import "./ThemedSearch.css"
import axios from 'axios'
//import SpotifyResultsTile from '../Results/SpotifyResultsTile'
import KeywordResultsTile from '../Results/KeywordResultsTile'


class ThemedSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            searchValue: ''
        }
    }

    handleSearchSubmit = async (e) => {
      this.setState({
        keywordsList: ''
      })
      e.preventDefault();
        await axios
         .get(`/api/theme-keyword?search=${this.state.searchValue}`)
         .then((response) => {
           this.generateKeywordResultsTiles(response.data)
         })
         .catch((e) => console.log(e));
     };
   
     generateKeywordResultsTiles = (searchResults) => {
       let tilesList = searchResults.map((result, index) => (
         <KeywordResultsTile key={index} result={result} />
       ));
       this.setState({
         keywordsList: tilesList,
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
            onClick={async (e) => {await this.handleSearchSubmit(e)}}
            value="SEARCH"
          />
        </div>
      </form>
      <div className="search-results theme">
      {this.state.keywordsList}
      </div>
      </>
    );
  }
}

export default ThemedSearch;
