import React from "react";
import './Login.css'

class Login extends React.Component {
  render() {
    return (
      <div className="login-frame">
        <h1>Login!</h1>
        <a href="/api/login">Login</a>
      </div>
    );
  }
}

export default Login;
