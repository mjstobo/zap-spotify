import React from "react";
import axios from "axios";
import SpotifyPlaylistTile from "../Results/SpotifyPlaylistTile";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zapPlaylist: [],
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    await this.retrievePlaylistData();
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
    });
  } else {
    this.setState({
      playlistTiles: "No song in playlist!"
    })
  }
  }

  retrievePlaylistData = async () => {
    let data = await axios
      .get("/api/playlists")
      .then((response) => {

      if(this._isMounted){
        this.setState({
          playlistMetadata: response.data.existingPlaylist[0],
          playlistTracks: response.data.playlistTracks
        })
        this.generatePlaylistTile(response.data.playlistTracks, response.data.existingPlaylist[0].id);
      }
      })
      .catch((e) => console.log(e));
    return data;
  }

  render() {
    return (
    <div className="search-results">
      {this.state.playlistTiles}
    </div>
    )}
}

export default Playlist;
