import React, { Fragment } from "react";
import {
    HashRouter,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import Error from '../Error/Error';
import Home from '../Home/Home';
import Search from '../Search/Search';
import ThemedSearch from '../ThemedSearch/ThemedSearch'
import './NavBar.css'


class NavBar extends React.Component {
  constructor(props){
    super(props);
    this.checkLoggedInStatus = this.checkLoggedInStatus.bind(this);
  }

  
  checkLoggedInStatus = () => {

    let songName = '';
    let artistName = '';
    let noSongPlaying = false;

    if(typeof this.props.currentTrack === 'object' && this.props.currentTrack !== null){
      songName = this.props.currentTrack.songName;
      artistName = this.props.currentTrack.artistName;
    } else {
      noSongPlaying = true;
    }

    if(this.props.isLoggedIn){
      if(noSongPlaying) {
        return noSongPlaying;
      }
      return <Fragment> {songName}, <br/> <span className="artist-name">{artistName}</span></Fragment>
    } else {
      console.log(this.props.isLoggedIn);
      return <a className="login-cta" href="/api/login">Login</a>
    }
  }

  render() {
    return (
     <HashRouter>
      <nav className="nav-bar">  
        <div className="nav-bar content">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/theme-search" className="nav-link">Theme Search</Link>
          <Link to="/search" className="nav-link">Search Spotify</Link>
        </div>
        <div className="now-playing">
          {this.checkLoggedInStatus()}
        </div>
      </nav>
      <div className="app-body">
      <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/theme-search" component={ThemedSearch}/>
          <Route exact path="/search" component={Search}/>
          <Route component={Error} />
      </Switch>
      </div>
      </HashRouter>
    );
  }
}

export default NavBar;
