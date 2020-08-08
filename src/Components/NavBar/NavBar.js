import React from "react";
import { Link } from 'react-router-dom'
import CurrentlyPlaying from "../CurrentlyPlaying/CurrentlyPlaying";


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  render() {
    return (
        <nav className="nav-bar">
          <div className="nav-bar content">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/playlist" className="nav-link">
              Playlist
            </Link>
          </div>
          <div className="now-playing">
            {this.props.currentTrack ? <CurrentlyPlaying songName={this.props.currentTrack.songName} artistName={this.props.currentTrack.artistName}/> : ""}
          </div>
        </nav>
    );
  }
}

export default NavBar;
