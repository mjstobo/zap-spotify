import React from "react";
import axios from "axios";
import SpotifyPlaylistTile from "../Results/SpotifyPlaylistTile";
import { toast } from "react-toastify";

class PlaylistComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasTracks: false,
      isLoaded: false,
      dataRequested: false,
    };

    this.removeFromPlaylist = this.removeFromPlaylist.bind(this);
    this.removeAllTracks = this.removeAllTracks.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    if (!this.state.dataRequested && this._isMounted) {
      await this.retrievePlaylistData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  removeFromPlaylist = async (track_id) => {
    let updatedPlaylist = this.state.playlistTracks.filter(
      (track) => track.track.id !== track_id
    );
    this.generatePlaylistTile(updatedPlaylist);
  };

  generatePlaylistTile = (
    playlistData,
    playlistId = this.state.playlistMetadata.id
  ) => {
    if (playlistData.length > 0) {
      let tilesList = playlistData.map((playlistItem, index) => (
        <SpotifyPlaylistTile
          key={index}
          result={playlistItem.track}
          playlistId={playlistId}
          removeFromPlaylist={this.removeFromPlaylist}
        />
      ));
      this.setState({
        playlistTracks: playlistData,
        playlistTiles: tilesList,
        hasTracks: true,
        dataRequested: true,
      });
    } else {
      this.setState({
        playlistTracks: playlistData,
        playlistTiles: "No song in playlist!",
        hasTracks: false,
        dataRequested: true,
      });
    }
  };

  retrievePlaylistData = async () => {
    console.log("Playlist.js retrieving playlist");
    let data = await axios
      .get("/api/playlists")
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            playlistMetadata: response.data.existingPlaylist[0],
            playlistTracks: response.data.playlistTracks,
            isLoaded: true,
            dataRequested: true,
          });
          this.generatePlaylistTile(
            response.data.playlistTracks,
            response.data.existingPlaylist[0].id
          );
        }
      })
      .catch((e) => console.log(e));
    return data;
  };

  removeAllTracks = async () => {
    await axios
    .get(`/api/remove-track`, {
      params: {
        all_tracks: true
      },
    })
    .then((response) => {
      toast(`Emptied the playlist!`);
      this.setState({
        playlistMetadata: '',
        playlistTracks: '',
        hasTracks: false,
        playlistTiles: "No song in playlist!"
      })
    });
  };

  render() {
    if (!this.state.isLoaded) {
      return (
        <div className="search-results playlist">
          <div className="searching loader">
            <div className="sk-folding-cube">
              <div className="sk-cube1 sk-cube"></div>
              <div className="sk-cube2 sk-cube"></div>
              <div className="sk-cube4 sk-cube"></div>
              <div className="sk-cube3 sk-cube"></div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="search-results playlist">
        <div className="playlist-controls">
          <h1 className="playlist-title">My Playlist</h1>
          {this.state.hasTracks ? (
            <button
              className="remove-tracks-cta"
              onClick={this.removeAllTracks}
            >
              <svg
                className="remove-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z" />
              </svg>
            </button>
          ) : (
            ""
          )}
        </div>
        {this.state.playlistTiles}
      </div>
    );
  }
}

export const Playlist = PlaylistComponent;
