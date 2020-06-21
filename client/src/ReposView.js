import React from 'react';
import RepoView from './RepoView'

class ReposView extends React.Component{

  render(){
    return(<div><ul>{this.props.repos.repos.map((repo, index) => <RepoView key={index} repo_data={repo} username={this.props.repos.login}/>)}</ul></div>)
  }

}

export default ReposView
