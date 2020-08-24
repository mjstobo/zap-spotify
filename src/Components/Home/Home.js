import React from "react";
import ThemedSearch from "../ThemedSearch/ThemedSearch";
import Search from "../Search/Search";


class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasSearched: false,
      searchedTerm: "",
      value: ""
    };

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSearchInputChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({
      searchedTerm: this.state.value,
      hasSearched: true,
    });
  }

  render() {
    return (
      <div className="home-frame">
        <h1 className="home-title">Welcome to <span className="zap-word">Zap.</span></h1>
        <h3 className="home-subtitle">
          Search for your theme keyword and find related songs and phrases
        </h3>
        <form className="search-component" onSubmit={this.handleSubmit}>
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.822 20.88l-6.353-6.354c.93-1.465 1.467-3.2 1.467-5.059.001-5.219-4.247-9.467-9.468-9.467s-9.468 4.248-9.468 9.468c0 5.221 4.247 9.469 9.468 9.469 1.768 0 3.421-.487 4.839-1.333l6.396 6.396 3.119-3.12zm-20.294-11.412c0-3.273 2.665-5.938 5.939-5.938 3.275 0 5.94 2.664 5.94 5.938 0 3.275-2.665 5.939-5.94 5.939-3.274 0-5.939-2.664-5.939-5.939z"/></svg>
          <input
            type="text"
            name="searchInput"
            className="search-bar"
            placeholder="Search for your theme"
            value={this.state.value}
            onChange={this.handleSearchInputChange}
          />
          <input
            type="submit"
            name="input-btn"
            className="search-bar-submit" 
            value={"Search"}
          />
        </form>

        <div className="panel-wrapper">
          <div className="panel">
            {this.state.hasSearched && (
              <Search
                searchValue={this.state.searchedTerm}
                playlistMetadata={this.props.playlistMetadata}
                playlistTracks={this.props.playlistTracks}
              />
            )}
          </div>
          <div className="panel">
            {this.state.hasSearched && (
              <ThemedSearch
                searchValue={this.state.searchedTerm}
                playlistMetadata={this.props.playlistMetadata}
                playlistTracks={this.props.playlistTracks}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export const Home = HomeComponent
