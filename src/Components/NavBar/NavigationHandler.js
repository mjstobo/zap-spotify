import React from "react";
import { HashRouter, Route, Switch, Link, Redirect } from "react-router-dom";
import Error from "../Error/Error";
import Home from "../Home/Home";
import Search from "../Search/Search";
import ThemedSearch from "../ThemedSearch/ThemedSearch";
import Login from "../Login/Login";
import CurrentlyPlaying from "../CurrentlyPlaying/CurrentlyPlaying";

import "./NavigationHandler.css";
import axios from "axios";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false 
    };
  }

  getCurrentTrack = async () => {
    axios
      .get(`${process.env.REACT_APP_ENDPOINT}/api/currently-playing`)
      .then((response) => {
        let currentTrack = response.data;
        if (currentTrack === false) {
          currentTrack = "No song playing right now!";
        }
        let songName = "";
        let artistName = "";
        let noSongPlaying = false;

        if (typeof currentTrack === "object" && currentTrack !== null) {
          songName = currentTrack.songName;
          artistName = currentTrack.artistName;
          let returnHtml = (
            <CurrentlyPlaying songName={songName} artistName={artistName} />
          );

          this.setState({
            currentTrack: currentTrack,
            currentTrackHtml: returnHtml,
            isLoaded: true
          });
          return returnHtml;
        } else {
          return noSongPlaying;
        }
      })
      .catch((e) => console.log("Failed to get track"));
  };

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.getCurrentTrack();
    }
  }

  render() {
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) =>
          this.props.isLoggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { isLoggedIn: this.props.isLoggedIn },
              }}
            />
          )
        }
      />
    );

    const PublicRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) =>
          this.props.isLoggedIn ? (
            <Redirect
              to={{
                pathname: "/login",
                state: { isLoggedIn: this.props.isLoggedIn },
              }}
            />
          ) : (
            <Component {...props} />
          )
        }
      />
    );

    return (
      <HashRouter>
        <nav className="nav-bar">
          <div className="nav-bar content">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/theme-search" className="nav-link">
              Theme Search
            </Link>
            <Link to="/search" className="nav-link">
              Search Spotify
            </Link>
          </div>
          <div className="now-playing">{this.state.currentTrackHtml}</div>
        </nav>
        <div className="app-body">
          <Switch>
            <PublicRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/theme-search" component={ThemedSearch} />
            <PrivateRoute exact path="/search" component={Search} />
            <PrivateRoute exact path="/" component={Home} />
            <PublicRoute component={Error} />
          </Switch>
        </div>
      </HashRouter>
    );

  }
}

export default NavBar;
