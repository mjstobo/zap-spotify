import React from "react";
import './ResultsTile.css';
import axios from "axios";

class ResultsTile extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }


  handleClick = () => {
    axios.get('/api/play', {
    params: {
      uri: this.props.result.uri
    }});
  }

  render() {
    return (
        <div className="results-tile">
          <div className="results-tile-content">
            <h4 className="results-heading">{this.props.result.name}</h4>
            <div className="results-tile-subcontent">
              <p className="results-artist">{this.props.result.artists[0].name}</p>
              <p className="results-album">{this.props.result.album.name}</p>  
            </div>
          </div>
          <button className="play-uri-btn" onClick={this.handleClick}>Play</button> 
        </div>
    );
  }
}

export default ResultsTile;
