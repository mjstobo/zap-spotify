import React from "react";
import './Home.css';
import ThemedSearch from '../ThemedSearch/ThemedSearch'
import Search from '../Search/Search';

class Home extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      hasSearched: false,
      searchedTerm: '',
      value: ""
    }

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSearchInputChange(e){
    this.setState({value: e.target.value });
  };

  handleSubmit(e) {
    e.preventDefault()  
     this.setState({
      searchedTerm: this.state.value,
      hasSearched: true
    })
  };

  render() {
    return (
      <div className="home-frame">
        <h1>Welcome to Zap</h1>
        <h2>Search for your theme keyword and find related songs and phrases</h2>
        <form className="search-component" onSubmit={this.handleSubmit}>
          <input  
            type="text"
            name="searchInput"
            className="search-bar"
            placeholder="Search for terms related to your playlist theme!"
            value={this.state.value}
            onChange={this.handleSearchInputChange}
          />
          <input
            type="submit"
            name="input-btn"
            className="search-bar-submit"
            value={'Search'}
          />
        </form>

        <div className="panel-wrapper">
        <div className="left-panel">
        {this.state.hasSearched && <Search searchValue={this.state.searchedTerm}/> }
        </div>
        <div className="right-panel">
        {this.state.hasSearched && <ThemedSearch searchValue={this.state.searchedTerm} />}
        </div>
      </div>
      </div>
    );
  }
}

export default Home;
