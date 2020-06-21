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
import './NavBar.css'


class NavBar extends React.Component {
  constructor(props){
    super(props);
    this.checkLoggedInStatus = this.checkLoggedInStatus.bind(this);
  }

  
  checkLoggedInStatus = () => {
    const songName = this.props.currentTrack ? this.props.currentTrack.songName : '';
    const artistName = this.props.currentTrack ? this.props.currentTrack.artistName : '';
    const songStatus = `${songName}, ${artistName}`

    if(this.props.isLoggedIn){
      return <Fragment> {songStatus}</Fragment>
    } else {
      console.log(this.props.isLoggedIn);
      return <a href="/api/login">Login</a>
    }
  }

  render() {

    return (
     <HashRouter>
      <nav className="nav-bar">  
        <div className="nav-bar content">
          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>
        </div>
        <div className="now-playing">
          {this.checkLoggedInStatus()}
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
