var express = require('express');
var app = express();
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

app.use(express.static(__dirname + '/new_img_folder'));

app.get('/', function (req, res) {
  res.send('hello world');
});

var getRandomIntInclusive = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/compound', function(req, res) {
    var options = {
        root: __dirname + '/new_img_folder/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };

      var path = __dirname + '/new_img_folder/';
      fs.readdir(path, function(err, items) {
          // pick a random int between 0 and items.length
          var fileName = getRandomIntInclusive(0,items.length);
          
          // TODO: check that this is a png file before sending

          res.sendFile(items[fileName], options, function (err) {
                if (err) {
                    console.log(err);
                    res.status(err.status).end();
                } else {
                    console.log('Sent:', items[fileName]);
                }
          });
      });
});

app.get('/compound_db', function(req, res) {
    // get a random compound from the db
    // Connection URL
    var url = 'mongodb://localhost:27017/test';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        var collection = db.collection('compounds');
      
        collection.find({}).toArray(function(err, docs) {
            if (err) throw err;
            // select a random item from the list
            var fileName = getRandomIntInclusive(0,docs.length);
            console.log(`random choice: ${fileName}`);
            var imageBuffer = new Buffer(docs[fileName].formula_img, 'base64');

            // send the png image back to the client
            res.set('Content-Type', 'image/png');
            res.send( imageBuffer );

            db.close();
        }); 
    });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});