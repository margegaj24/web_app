import React from 'react'
import ReactDOM from 'react-dom'
import ReposView from './ReposView'
import { Card, Button } from 'react-bootstrap'

class ProfileView extends React.Component{

  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    try {
      fetch('http://localhost:4004/user-repos', {method: 'POST', body: this.props.userdata.login})
      .then(response => response.text())
      .then(userrepos => JSON.parse(userrepos))
      .then(repos => repos.map(repo => ({
        owner: repo.owner.login,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        url: repo.html_url
      })))
      .then(repos => { var starred_repos = {'login': this.props.userdata.login, 'repos': repos}; this.loadReposView(starred_repos)})
    } catch (e) {
      console.log(e)
    } finally {}
  }

  loadReposView(repos){
    ReactDOM.render(
          <ReposView repos={repos} />,
        document.getElementById('root')
    )
  }

  render() { return (
    <Card className='text-center' style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{this.props.userdata.login}</Card.Title>
        <Card.Text>{this.props.userdata.followers} Followers </Card.Text>
        <Card.Text>Following {this.props.userdata.following} </Card.Text>
        <Card.Text>{this.props.userdata.public_gists} public gists </Card.Text>
        <Button variant="primary" onClick={this.handleClick}>Get user repositories</Button>
      </Card.Body>
    </Card>
  )}
}

export default ProfileView
