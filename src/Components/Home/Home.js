import React from "react";
import './Home.css';
import ThemedSearch from '../ThemedSearch/ThemedSearch'

class Home extends React.Component {
  render() {
    return (
      <div className="home-frame">
        <h1>Welcome to Zap</h1>
        <h2>Search for your theme keyword and find related songs and phrases</h2>
        <ThemedSearch/>
      </div>
    );
  }
}

export default Home;
