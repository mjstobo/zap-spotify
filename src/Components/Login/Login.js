import React from "react";

class Login extends React.Component {
  render() {
    return (
      <div className="login-frame">
        <h1 className="login-title">LOGIN</h1>
        <p>This application requires a Spotify account. <br/>Click below to login via Spotify. </p>
        <a className="login-frame-cta" href={`/api/login`}>LOGIN</a>
      </div>
    );
  }
}

export default Login;
