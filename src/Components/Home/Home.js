import React from "react";
import './Home.css';
import ThemedSearch from '../ThemedSearch/ThemedSearch'
import Search from '../Search/Search';

class Home extends React.Component {
  render() {
    return (
      <div className="home-frame">
        <h1>Welcome to Zap</h1>
        <h2>Search for your theme keyword and find related songs and phrases</h2>
        <div className="panel-wrapper">
        <div className="left-panel">
        <Search/>
        </div>
        <div className="right-panel">
        <ThemedSearch/>

        </div>
      </div>
      </div>
    );
  }
}

export default Home;
