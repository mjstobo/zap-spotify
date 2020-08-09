import React from "react";
import axios from "axios";

class CurrentlyPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: "",
    };
  }

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
          });
        }
      })
      .catch((e) => console.log("Failed to get track"));
  };

  componentDidMount() {
    this.getCurrentTrack();
    this.timer = setInterval(() => this.getCurrentTrack(), 10000);
  }

  render() {
    if (this.state.currentTrack) {
      return (
        <div className="now-playing">
          {this.state.currentTrack.songName}, <br />
          <span className="artist-name">
            {this.state.currentTrack.artistName}
          </span>
        </div>
      );
    } else {
      return (
        <div className="now-playing">
          <span className="artist-name">Not playing anything.</span>
        </div>
      );
    }
  }
}

export default CurrentlyPlaying;
