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

  generatePlaylistTile = (playlistData, playlistId) => {
    if(playlistData.length > 0){
    let tilesList = playlistData.map((playlistItem, index) => (
      <SpotifyPlaylistTile key={index} result={playlistItem.track} playlistId={playlistId} />
    ));
    this.setState({
      playlistTiles: tilesList,
    });
  }
  }

  retrievePlaylistData = async () => {
    let data = await axios
      .get("/api/playlists")
      .then((response) => {

      if(this._isMounted){
        this.setState({
          playlistMetadata: response.data.existingPlaylist,
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
