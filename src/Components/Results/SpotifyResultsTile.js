import React from "react";
import axios from "axios";

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
    }});
  }

  handleAddToPlaylistClick = async () => {
    console.log(this.props.playlistId)
    await axios.get('/api/add-track', {
      params: {
        uris: this.props.result.uri,
        playlist_id: this.props.playlistId
      }
    })
    .then(response => console.log(response.data));
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
          <button className="play-uri-btn" onClick={this.handlePlayClick}>Play</button>
          <button className="playlist-btn" onClick={this.handleAddToPlaylistClick}>+</button> 
        </div>
    );
  }
}

export default SpotifyResultsTile;
