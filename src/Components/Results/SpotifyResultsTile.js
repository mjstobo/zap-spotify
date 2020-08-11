import React from "react";
import axios from "axios";
import { toast } from 'react-toastify';

class SpotifyResultsTile extends React.Component {
  constructor(props){
    super(props);
    this.handlePlayClick = this.handlePlayClick.bind(this);

    this.state = {
      subResultClass: this.props.type === 'subresult' ? ('results-tile subresult') : ('results-tile'),
    };
  }

  handlePlayClick = async () => {
    axios.get(`${process.env.REACT_APP_ENDPOINT}/api/play`, {
    params: {
      uri: this.props.result.uri
    }}).then(() => toast(`Playing ${this.props.result.name}`));
  }

  handleAddToPlaylistClick = async () => {
    console.log(this.props.playlistId)
    await axios.get('/api/add-track', {
      params: {
        uris: this.props.result.uri,
        playlist_id: this.props.playlistId
      }
    })
    .then(() => toast(`Added ${this.props.result.name} to playlist`));
  }

  render() {
    return (
        <div className={this.state.subResultClass}>
        {this.props.result.album.images[0] && <img className="results-art" alt={`Album art for ${this.props.result.album.name}`} src={this.props.result.album.images[0].url}/>}
          <div className="results-tile-content">
            <h4 className="results-heading">{this.props.result.name}</h4>
            <div className="results-tile-subcontent">
              <p className="results-artist">{this.props.result.artists[0].name}</p>
              <p className="results-album">{this.props.result.album.name}</p>  
            </div>
          </div>
          <div className="btn-container">
          <button className="play-uri-btn" onClick={this.handlePlayClick}>PLAY</button>
          <button className="playlist-btn" onClick={this.handleAddToPlaylistClick}><svg xmlns="http://www.w3.org/2000/svg" className="playlist-icon" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg></button> 
          </div>
        </div>
    );
  }
}

export default SpotifyResultsTile;
