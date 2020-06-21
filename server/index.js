const express = require('express')
const cors = require('cors')
const { createBasicAuth } = require("@octokit/auth-basic")
const { request } = require("@octokit/request")
const bodyParser = require('body-parser')

const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const db_url = 'mongodb://127.0.0.1:27017';
const db_name = 'repos';

const app = express();

app.use(cors())

app.get('/', (req, res) => res.send('hello friend'))

app.post('/login', function(req, res){
  
  var body = '';
  req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
  
  req.on('end', () => {
  
    const auth = createBasicAuth({
      username: body.split('&')[0],
      password: body.split('&')[1],
      async on2Fa() {
        // prompt user for the one-time password retrieved via SMS or authenticator app
        return question("Two-factor authentication Code: ");
      }
    });

    const requestWithBasicAuth = request.defaults({
      request: {
        hook: auth.hook
      }
    });

    requestWithBasicAuth("GET /user").then(
      response => res.send(JSON.stringify(response.data))
    );
  });
})

app.post('/user-repos', (req, res) => {
  
  var username = '';
  
  req.on('data', chunk => {
        username += chunk.toString(); // convert Buffer to string
  })
  
  req.on('end', () => {
    //send all data on client side for further processing
    request('GET /users/' + username + '/starred').then(response => res.send(JSON.stringify(response.data)))	
  })  
})

app.post('/save-repo/:username', bodyParser.urlencoded({extended: false}), (req, res) => {
  
  var repo;
  var username = req.url.split('/')[2]
  
  req.on('data', chunk => {
    repo += chunk.toString();
  })
  
  req.on('end', () => {
    console.log(repo)
    repo = JSON.parse(repo.substr(9))
    mongoClient.connect(db_url, { useUnifiedTopology: true }, (error, client) => {
      assert.equal(null, error)
      const db = client.db(db_name).collection('repos')
      //before updating we need to check if that repo exist in the user's repos collection
      db.findOne({'uname': username, 'repos': {$elemMatch: {'url': repo.url }}})
      .then(result1 => { 
      	if (result1 == undefined) 
      	  //user and repository doesn't exist so we need to insert one
      	  db.insertOne({'uname': username, 'repos': [repo]}).then(res.send('Repository added.')).catch(e => console.log(e))
    	else {
    	  // user and repository exists
    	  if(result1.repos.length > 0) res.send('Repository already saved.')
    	  else //user exists but repository doesn't exist so we should push the repo to repositories list 
    	    db.updateOne({'uname': username}, {'$push': {repos: repo}})
      	    .then(result2 => {
    	      const { modifiedCount } = result2;
    	        if(modifiedCount) res.send('Repository added')
    	        else res.send('Not updated... I don\'t know what happened :(')
      	    }).catch(e => console.log(e))
      	}
      }).catch(e => console.log(e))
    })
  }) 
})

app.listen(4004)
console.log('listening on port: 4004');
