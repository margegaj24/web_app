import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./Login.css";
//import App from './App'
import ProfileView from './ProfileView'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0
  }

  function handleSubmit(event) {

    fetch('http://localhost:4004/login', {method: 'POST', body: username + '&' + password})
    .then(response => response.text())
    .then(userdata => JSON.parse(userdata))
    .then(data => loadProfileView(data))

    event.preventDefault();
  }

  function loadProfileView(userdata){
    ReactDOM.render(
          <ProfileView userdata={userdata} />,
        document.getElementById('root')
    )
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email">
          <FormLabel>Username</FormLabel>
          <FormControl
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bssize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}
