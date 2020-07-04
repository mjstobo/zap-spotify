import React from "react";

class CurrentlyPlaying extends React.Component {
  render() {
    return (
        <div>
        {" "}
        {this.props.songName}, <br />{" "}
        <span className="artist-name">{this.props.artistName}</span>
      </div>
    );
  }
}

export default CurrentlyPlaying;
