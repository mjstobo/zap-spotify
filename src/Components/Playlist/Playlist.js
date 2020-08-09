import React from "react";
import axios from "axios";
import SpotifyPlaylistTile from "../Results/SpotifyPlaylistTile";

class PlaylistComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasTracks: false,
      isLoaded: true,
      dataRequested: false
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    if(!this.state.dataRequested && this._isMounted){
      await this.retrievePlaylistData();
    }
  }

  componentWillUnmount(){
    this._isMounted= false
  }

  removeFromPlaylist = (track_id) => {
    let updatedPlaylist = this.state.playlistTracks.filter(track => track.track.id !== track_id);
    console.log(updatedPlaylist)
    this.setState({
      playlistTracks: this.generatePlaylistTile(updatedPlaylist)
    })
  }

  generatePlaylistTile = (playlistData, playlistId = this.state.playlistMetadata.id) => {
    if(playlistData.length > 0){
    let tilesList = playlistData.map((playlistItem, index) => (
      <SpotifyPlaylistTile key={index} result={playlistItem.track} playlistId={playlistId} removeFromPlaylist={this.removeFromPlaylist}/>
    ));
    this.setState({
      playlistTiles: tilesList,
      hasTracks: true,
      dataRequested: true
    });
  } else {
    this.setState({
      playlistTiles: "No song in playlist!",
      hasTracks: false,
      dataRequested: true
    })
  }
  }

  retrievePlaylistData = async () => {
    console.log("Playlist.js retrieving playlist");
    let data = await axios
      .get("/api/playlists")
      .then((response) => {

      if(this._isMounted){
        this.setState({
          playlistMetadata: response.data.existingPlaylist[0],
          playlistTracks: response.data.playlistTracks,
          isLoaded: true,
          dataRequested: true
        })
        this.generatePlaylistTile(response.data.playlistTracks, response.data.existingPlaylist[0].id);
      }
      })
      .catch((e) => console.log(e));
    return data;
  }

  render() {
    if (!this.state.isLoaded) {
      return (
      <div className="searching loader">
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
    <div className="search-results">
      {this.state.hasTracks ? (<div> Remove all tracks </div>) : ''}
      {this.state.playlistTiles}
    </div>
    )}
}

export const Playlist = PlaylistComponent
