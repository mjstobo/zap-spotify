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
      let currentTrack = response.data;
      if(currentTrack === false){
        currentTrack = 'No song playing right now!';
      }
        this.setState({
          currentTrack: currentTrack
        })
      }
    )
    .catch(e => console.log(e));
  }

   componentDidMount(){ 
   axios.get('/api/session')
        .then(response => {
          let isLoggedIn = response.data.loggedIn;
          let session_id = response.data.session_id;
          if(isLoggedIn) {
            this.getCurrentTrack()
          }
          this.setState({
            isLoggedIn: isLoggedIn,
            session_id: session_id
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
