import React from "react";
import { Link } from 'react-router-dom'
import CurrentlyPlaying from "../CurrentlyPlaying/CurrentlyPlaying";


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  render() {
    return (
        <nav className="nav-bar">
          <div className="nav-bar content">
            <Link to="/" className="nav-link">
              <span className="nav-link-text">HOME</span>
              <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z"/></svg>
            </Link>
            <Link to="/playlist" className="nav-link">
            <span className="nav-link-text">PLAYLIST</span>
              <svg className="nav-icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M12 21h-12v-2h12v2zm4-9l8-1v6.681c-.002 1.555-1.18 2.319-2.257 2.319-.907 0-1.743-.542-1.743-1.61 0-.96.903-1.852 2-2.073v-2.317l-4 .5v4.181c-.002 1.555-1.18 2.319-2.257 2.319-.907 0-1.743-.542-1.743-1.61 0-.96.903-1.852 2-2.073v-5.317zm-4 4.976h-12v-2h12v2zm0-3.976h-12v-2h12v2zm12-4h-24v-2h24v2zm0-4h-24v-2h24v2z"/></svg>
            </Link>
          </div>
          <div>
            <CurrentlyPlaying />
          </div>
        </nav>
    );
  }
}

export default NavBar;
