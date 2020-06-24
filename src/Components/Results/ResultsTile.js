import React from "react";

class ResultsTile extends React.Component {
  render() {
    return (
        <div className="results-tile">
            <h5>{this.props.result.artistName}</h5>
            <p>{this.props.result.songName}</p>
            <p>{this.props.result.albumName}</p>            
        </div>
    );
  }
}

export default ResultsTile;
