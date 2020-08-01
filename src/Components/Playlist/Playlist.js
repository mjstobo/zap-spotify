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
    let playlistData = await this.retrievePlaylistData();
    this.generatePlaylistTile(playlistData);
  }

  componentWillUnmount(){
    this._isMounted= false
  }

  generatePlaylistTile = (playlistData) => {
    if(playlistData.tracks.length > 0){
    let tilesList = playlistData.map((result, index) => (
      <SpotifyResultsTile key={index} result={result} />
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
          zapPlaylist: response.data[0]
        })
      }
        return response.data[0];
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
