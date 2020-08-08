import React from "react";
import axios from "axios";

class SpotifyPlaylistTile extends React.Component {
  constructor(props){
    super(props);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handleRemoveFromPlaylistClick = this.handleRemoveFromPlaylistClick.bind(this);

    this.state = {};
  }

  handlePlayClick = async () => {
    await axios.get(`/api/play`, {
    params: {
      uri: this.props.result.uri
    }});
  }

  handleRemoveFromPlaylistClick = async () => {
    axios.get(`/api/remove-track`, {
        params: {
          playlist_id: this.props.playlistId,
          track_id: this.props.result.uri
        }})
        .then(response => {
            this.props.removeFromPlaylist(this.props.result.id);
        })
  }

  render() {
    return (
        <div className="results-tile">
        {this.props.result.album.images[0] && <img className="results-art" alt={`Album art for ${this.props.result.album.name}`} src={this.props.result.album.images[0].url}/>}
          <div className="results-tile-content">
            <h4 className="results-heading">{this.props.result.name}</h4>
            <div className="results-tile-subcontent">
              <p className="results-artist">{this.props.result.artists[0].name}</p>
              <p className="results-album">{this.props.result.album.name}</p>  
            </div>
          </div>
          <button className="play-uri-btn" onClick={this.handlePlayClick}>PLAY</button>
          <button className="playlist-btn" onClick={this.handleRemoveFromPlaylistClick}>x</button> 
        </div>
    );
  }
}

export default SpotifyPlaylistTile;
