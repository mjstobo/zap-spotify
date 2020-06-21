import React from "react";
import NavBar from './NavBar/NavBar'
import Cookies from 'js-cookie';
import axios from 'axios';


class AppFrame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      spotifyToken: false
    };  
  }

  componentDidMount(){
   let isLoggedIn = false;
   let spotifyAccess = Cookies.get('spotifyAccess');
   if(spotifyAccess){
     isLoggedIn = true;
   }
   axios.get('/api/currently-playing')
        .then(response => {
          const currentTrack = response.data;
          this.setState({
            currentTrack: currentTrack
          })
          console.log(currentTrack)
        })
        .catch(e => console.log(e));

    this.setState({
      spotifyToken: spotifyAccess,
      isLoggedIn: isLoggedIn
    })
   }
  
  render() {
    return (
      <div className="App">
        <NavBar currentTrack={this.state.currentTrack} isLoggedIn={this.state.isLoggedIn} />
      </div>
    );
  }
}

export default AppFrame;
