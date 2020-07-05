import React from "react";
import NavBar from "./NavBar/NavigationHandler";
import axios from "axios";

class AppFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  componentDidMount = async () => {
    try {
      return await this.checkLoggedIn().then(() => {
        this.setState({
          isLoaded: true,
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  checkLoggedIn = async () => {
    try {
      await axios
        .get("/api/session")
        .then((response) => {
          let isLoggedIn = response.data.loggedIn;
          let session_id = response.data.session_id;
          if (isLoggedIn) {
            this.setState({
              isLoggedIn: true,
              session_id: session_id,
              isLoaded: true,
            });
          } else {
            this.setState({
              isLoaded: true,
            });
          }
        })
        .catch((e) =>
          this.setState({
            isLoggedIn: false,
          })
        );
    } catch (e) {
      console.log(e);
    }

    return;
  };

  render() {
    if (!this.state.isLoaded) {
      return (
      <div className="App loader">
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>
      </div>
      );
    }
    return (
      <div className="App">
        <NavBar isLoggedIn={this.state.isLoggedIn} />
      </div>
    );
  }
}

export default AppFrame;
