import React from "react";

class Login extends React.Component {
  render() {
    return (
      <div className="login-frame">
        <h1>Login</h1>
        <p>This application requires a Spotify Premium account. <br/>Click below to login via Spotify. </p>
        <a className="login-frame-cta" href={`${process.env.REACT_APP_ENDPOINT}/api/login`}>Login</a>
      </div>
    );
  }
}

export default Login;
