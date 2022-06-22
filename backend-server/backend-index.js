const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const axios = require('axios');

const PORT = process.env.PORT || 3001;
const app = express();

// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../my-react-app/build')));

function getComic(id){
  return new Promise((resolve, reject) => {
    if (id == null){
      var url = 'https://xkcd.com/info.0.json';
    }
    else{
      var url = 'https://xkcd.com/' + id + '/info.0.json';
    }
    axios.get(url).then( (res) => {
      if (res.status != 200){
        let err = {statusCode: res.status, message: 'Failed to get comic with id ' + id};
        reject(new Error(JSON.stringify(err)));
      }
      else {
        resolve(res.data);
      }
    }).catch( (err) => {
      let statusCode;
      if (err.response){
        errStatusCode = err.response.status;
      }
      else {
        errStatusCode = 400;
      }
      let err_json = {statusCode: errStatusCode, message: err.message};
      reject(new Error(JSON.stringify(err_json)));
    });
  });
}

  //   var req = https.request(options, res => {
  //     if (res.statusCode != 200){
  //       var error = {statusCode: res.statusCode, message: 'Failed to get comic with id ' + id};
  //       reject(new Error(JSON.stringify(error)));
  //     }
  //     else {
  //       var buffer = Buffer.from('');
  //       res.on('data', d => {
  //         buffer.write(d);
  //       })
  //       res.on('end', () => {
  //         let str = buffer.toString();
  //         resolve(JSON.parse(buffer.toString('utf8')));
  //       });
  //     }
  //   });

  //   req.on('error', error => {
  //     var error = {statusCode: 400, message: 'Request error when requesting comic with id ' + id, detail: error};
  //     reject(new Error(JSON.stringify(error)));
  //   });

  //   req.end();
  // });

// Handle GET requests to /api/*
app.get('/api/*', (req, res)=>{
  if (req.url == '/api/comics/latest'){
    var comic_id = null;
  }
  else{
    var regex = new RegExp("^\/api\/comics\/(\\d+)$");
    var match = req.url.match(regex);
    if (match != null){
      var comic_id = match[1];
    }
    else {
      let res_json = {'Status Code': 400, 'Error Message': 'Malformed url'};
      res.status(400).json(res_json);
      return;
    }
  }
  getComic(comic_id).then(resolve => {
    res.status(200).json(resolve);
  }).catch(err=>{
    let res_json = JSON.parse(err.message);
    res.status(res_json.statusCode).json(res_json);
  });
});

// All other GET requests not handled before will return our React app
//app.get('*', (req, res)=>{
//  res.sendFile(path.resolve(__dirname, '../my-react-app/build', 'index.html'));
//});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
