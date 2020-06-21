import React from "react";
import {
    HashRouter,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import Error from '../Error/Error';
import Home from '../Home/Home';
import Search from '../Search/Search';
import './NavBar.css'


class NavBar extends React.Component {

  render() {

    const songTitle = this.props.currentTrack ? this.props.currentTrack.songName : '';
    const artistName = this.props.currentTrack ? this.props.currentTrack.artistName : '';
    

    return (
     <HashRouter>
      <nav className="nav-bar">  
        <div className="nav-bar content">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
        </div>
        <div className="now-playing">
          {this.props.isLoggedIn && <a href="/api/login">Login</a>} 
          {songTitle}, {artistName}
        </div>
      </nav>
      <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/search" component={Search}/>
          <Route component={Error} />
      </Switch>
      </HashRouter>
    );
  }
}

export default NavBar;
