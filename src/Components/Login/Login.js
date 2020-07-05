import React from "react";
import './Login.css'

class Login extends React.Component {
  render() {
    return (
      <div className="login-frame">
        <h1>Login!</h1>
        <p>This application requires a Spotify Premium account. <br/>Click below to login via Spotify. </p>
        <a className="login-frame-cta" href="/api/login">Spotify Login</a>
      </div>
    );
  }
}

export default Login;
