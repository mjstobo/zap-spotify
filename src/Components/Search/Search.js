import React from "react";
import './Search.css'

class Search extends React.Component {
  render() {
    return (
      <div className="search-frame">
        <h1>Search!</h1>
        <div class="search-bar">
          <input class="search-bar input" label="Search for Artists, Tracks etc"></input>
        </div>
      </div>
    );
  }
}

export default Search;