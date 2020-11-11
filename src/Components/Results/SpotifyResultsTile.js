import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

class SpotifyResultsTile extends React.Component {
  constructor(props) {
    super(props);
    this.handlePlayClick = this.handlePlayClick.bind(this);

    this.state = {
      subResultClass:
        this.props.type === "subresult"
          ? "results-tile subresult"
          : "results-tile",
    };
  }

  handlePlayClick = async () => {
    axios
      .get(`/api/play`, {
        params: {
          uri: this.props.result.uri,
        },
      })
      .then(() => toast(`Playing ${this.props.result.name}`))
      .catch((error) => {
        toast(`Unable to play track.`);
    });
  };

  handleAddToPlaylistClick = async () => {
    console.log(this.props.playlistId);
    await axios
      .get("/api/add-track", {
        params: {
          uris: this.props.result.uri,
          playlist_id: this.props.playlistId,
        },
      })
      .then(() => toast(`Added ${this.props.result.name} to playlist`))
      .catch((error) => {
        toast(`Unable to add track.`);
    });
  };

  render() {
    return (
      <div className={this.state.subResultClass}>
        {this.props.result.album.images[0] && (
          <img
            className="results-art"
            alt={`Album art for ${this.props.result.album.name}`}
            src={this.props.result.album.images[0].url}
          />
        )}
        <div className="results-tile-content">
          <h4 className="results-heading">{this.props.result.name}</h4>
          <div className="results-tile-subcontent">
            <p className="results-artist">
              {this.props.result.artists[0].name}
            </p>
            <p className="results-album">{this.props.result.album.name}</p>
          </div>
        </div>
        <div className="btn-container">
          <button className="play-uri-btn" onClick={this.handlePlayClick}>
            {" "}
            <svg
              className="play-btn-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M3 22v-20l18 10-18 10z" />
            </svg>
          </button>
          <button
            className="playlist-btn"
            onClick={this.handleAddToPlaylistClick}
          >
            <svg
              className="playlist-icon"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
          </button>
        </div>
      </div>
    );
  }
}

export default SpotifyResultsTile;
