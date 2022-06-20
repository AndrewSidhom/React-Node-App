const express = require('express');
const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3001;
const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../my-react-app/build')));

function getComic(id){
  return new Promise((resolve, reject) => {
    if (id == null){
      var pathname = '/info.0.json';
    }
    else{
      var pathname = '/' + id + '/info.0.json';
    }
    var options = {
      hostname: 'xkcd.com',
      path: pathname,
      method: 'GET'
    };

    var req = https.request(options, res => {
      if (res.statusCode != 200){
        var error = {statusCode: res.statusCode, message: 'Failed to get comic with id' + id};
        reject(error);
      }
      res.on('data', d => {resolve(d);});
    });

    req.on('error', error => {
      var error = {statusCode: 400, message: 'Request error when requesting comic with id ' + id, detail: error};
      reject(error);
    });

    req.end();
  });
}

// Handle GET requests to /api/*
app.get('/api/*', (req, res)=>{
  if (req.url == '/api/'){
    var comic_id = null;
  }
  else{
    var regex = new RegExp("^\/api\/comics\/(\\d+)$");
    var match = req.url.match(regex);
    if (match != null){
      var comic_id = match[1];
    }
    else {
      res.writeHead(400, {'Content-Type': 'application/json'});
      var res_json = 'Status Code: 400\nError Message: ' + 'Malformed url';
      res.json(res_json);
      return;
    }
  }
    var res_json = getComic(comic_id).then(res_html => {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.json(res_json);
    }).catch(err=>{
      res.writeHead(err.statusCode, {'Content-Type': 'text/html'});
      res_json = 'Status Code: ' + err.statusCode + '\nError Message: ' + err.message + '\nDetail: ' + err.detail;
      res.json(res_json);
    });
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname, '../my-react-app/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
