import React from "react";
import axios from "axios";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import {Home} from "./Home/Home";
import ThemedSearch from "./ThemedSearch/ThemedSearch";
import {Playlist} from "./Playlist/Playlist";
import Login from "./Login/Login";
import NavBar from './NavBar/NavBar'


class AppFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount = async () => {
    try {
      await this.checkLoggedIn().then(() => {
        this.setState({
          isLoaded: true,
        });
      });
      if (this.state.isLoggedIn) {
        await this.retrievePlaylistData();
        await this.getCurrentTrack();
      }
    } catch (e) {
      console.log(e);
    }
  };

  retrievePlaylistData = async () => {
    console.log("AppFrame retrieving playlist data");
    await axios
      .get("/api/playlists")
      .then((response) => {
        this.setState({
          playlistMetadata: response.data.existingPlaylist[0],
          playlistTracks: response.data.playlistTracks,
        });
      })
      .catch((e) => console.log(e));
  };

  checkLoggedIn = async () => {
    try {
      await axios
        .get(`${process.env.REACT_APP_ENDPOINT}/api/session`)
        .then((response) => {
          let isLoggedIn = response.data.loggedIn;
          let session_id = response.data.session_id;
          if (isLoggedIn) {
            this.setState({
              isLoggedIn: true,
              session_id: session_id,
              isLoaded: true,
            });
          } else {
            this.setState({
              isLoaded: true,
            });
          }
        })
        .catch((e) =>
          this.setState({
            isLoggedIn: false,
          })
        );
    } catch (e) {
      console.log(e);
    }

    return;
  };

  getCurrentTrack = async () => {
    await axios
      .get(`/api/currently-playing`)
      .then((response) => {
        let currentTrack = response.data;

        if (!currentTrack) {
          currentTrack = "No song playing right now!";
        }

        if (typeof currentTrack === "object" && currentTrack !== null) {
          
          this.setState({
            currentTrack: currentTrack,
            isLoaded: true,
          });}
      })
      .catch((e) => console.log("Failed to get track"));
  };


  render() {
    
  const PrivateRoute = ({ render: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        this.state.isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { isLoggedIn: this.state.isLoggedIn },
            }}
          />
        )
      }
    />
  );

  const PublicRoute = ({ render: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        this.state.isLoggedIn ? (
          <Redirect
            to={{
              pathname: "/login",
              state: { isLoggedIn: this.state.isLoggedIn },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );

    if (!this.state.isLoaded) {
      return (
        <div className="App loader">
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
      <div className="App">
      <HashRouter>
        <NavBar isLoggedIn={this.state.isLoggedIn} currentTrack={this.state.currentTrack} />
        <div className="app-body">
          <Switch>
            <PublicRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/theme-search" component={ThemedSearch} />
            <PrivateRoute exact path="/playlist" render={(props) => (<Playlist playlistMetadata={this.state.playlistMetadata} playlistTracks={this.state.playlistTracks} {...props}/>)}/>
            <PrivateRoute exact path="/" render={(props) => (<Home playlistMetadata={this.state.playlistMetadata} playlistTracks={this.state.playlistTracks} {...props}/>)} />
            <PublicRoute component={Error} />
          </Switch>
        </div>
      </HashRouter>      
      
      </div>
    );
  }
}

export default AppFrame;
