import React from 'react'
import { Card, Button } from 'react-bootstrap'

class RepoView extends React.Component{

  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    try {
      fetch('http://localhost:4004/save-repo/' + this.props.username, {method: 'POST', body: JSON.stringify(this.props.repo_data)})
      .then(message => message.text())
      .then(msg => alert(msg))
    } catch (e) { console.log(e) }
    event.preventDefault();
  }

  render() {
    return(
      <li>
        <Card className='text-center' border='primary' style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title bg='danger' position='center'>{this.props.repo_data.name}</Card.Title>
            <Card.Text>
              {this.props.repo_data.description}
            </Card.Text>
            <Card.Text>Written in: {this.props.repo_data.language}</Card.Text>
            <Button bg='primary' variant="primary" onClick={this.handleClick}>Save this repo</Button>
          </Card.Body>
        </Card>
      </li>)
  }

}

export default RepoView
