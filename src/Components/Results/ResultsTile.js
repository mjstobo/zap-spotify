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
    console.log(this.props.result)
    return (
        <div className="results-tile">
            <h4 className="results-heading">{this.props.result.name}</h4>
            <p>By {this.props.result.artists[0].name}</p>
            <p>From {this.props.result.album.name}</p>  
            <button className="play-uri-btn" onClick={this.handleClick}>Play</button> 
        </div>
    );
  }
}

export default ResultsTile;
