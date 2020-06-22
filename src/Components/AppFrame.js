import React from "react";
import NavBar from './NavBar/NavBar'
import axios from 'axios';


class AppFrame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      spotifyToken: false
    };  
  }

  getCurrentTrack = () => {
    axios.get('/api/currently-playing')
    .then(response => {
      const currentTrack = response.data;
      this.setState({
        currentTrack: currentTrack
      })
    })
    .catch(e => console.log(e));
  }

   componentDidMount(){ 
   axios.get('/api/session')
        .then(response => {
          let isLoggedIn = response.data.loggedIn;
          let session_token = response.data.session_token;
          if(isLoggedIn) {
            this.getCurrentTrack()
            console.log(isLoggedIn, session_token)
          }
          this.setState({
            isLoggedIn: isLoggedIn,
            session_token: session_token
          })  
   })
   .catch(e => console.log(e))
  }
  
  render(){
    return (
      <div className="App">
        <NavBar currentTrack={this.state.currentTrack} isLoggedIn={this.state.isLoggedIn} />
      </div>
    );
  }
}

export default AppFrame;
