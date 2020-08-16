import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

class SpotifyPlaylistTile extends React.Component {
  constructor(props) {
    super(props);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleRemoveFromPlaylistClick = this.handleRemoveFromPlaylistClick.bind(
      this
    );
    this.removeFromPlaylist = this.removeFromPlaylist.bind(this);
    this.state = {};
  }

  handlePlayClick = async () => {
    await axios
      .get(`/api/play`, {
        params: {
          uri: this.props.result.uri,
        },
      })
      .then(() => toast(`Playing ${this.props.result.name}`))
      .catch((e) => {
        if (e.response.status === 404) {
          toast("Unable to find Spotify device.");
        }
      });
  };

  handleRemoveFromPlaylistClick = async () => {
    await axios
      .get(`/api/remove-track`, {
        params: {
          playlist_id: this.props.playlistId,
          track_id: this.props.result.uri,
        },
      })
      .then((response) => {
        toast(`Removed ${this.props.result.name} from playlist`);
        console.log(this.props.result.id);
        this.removeFromPlaylist(this.props.result.id);
      });
  };

  removeFromPlaylist(track_id) {
    this.props.removeFromPlaylist(track_id);
  }

  render() {
    return (
      <div className="results-tile">
        {this.props.result.album.images[0] && (
          <img
            className="results-art playlist-art"
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
            onClick={this.handleRemoveFromPlaylistClick}
          >
            <svg className="playlist-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>
          </button>
        </div>
      </div>
    );
  }
}

export default SpotifyPlaylistTile;
