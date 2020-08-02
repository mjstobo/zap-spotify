import React from "react";
import axios from "axios";
import SpotifyResultsTile from "../Results/SpotifyResultsTile";

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

  generatePlaylistTile = (playlistData) => {
    if(playlistData.length > 0){
    let tilesList = playlistData.map((playlistItem, index) => (
      <SpotifyResultsTile key={index} result={playlistItem.track} />
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
      }
       this.generatePlaylistTile(this.state.playlistTracks);
      })
      .catch((e) => console.log(e));
      console.log(data);
    return data;
  }

  render() {
    return (
    <div>
      {this.state.playlistTiles}
    </div>
    )}
}

export default Playlist;
