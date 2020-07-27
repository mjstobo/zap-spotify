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
          keywordsList: "",
          isLoaded: false
        }
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
         .get(`/api/theme-keyword?search=${e}`)
         .then((response) => {
           this.setState({
             searchValue: e,
             isLoaded: true
           })
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
      {this.state.keywordsList && <h4 className="search-summary">Related keywords for <span className="search-term">{this.state.searchValue}</span></h4>}
      <div className="search-results theme">
      {this.state.keywordsList}
      </div>
      </>
    );
  }
}

export default ThemedSearch;
