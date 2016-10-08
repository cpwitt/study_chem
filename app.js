var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname + '/new_img_folder'));

app.get('/', function (req, res) {
  res.render('index');
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
          console.log(items[fileName]);

          res.sendFile(items[fileName], options, function (err) {
                  if (err) {
                    console.log(err);
                    res.status(err.status).end();
                  }
                  else {
                    console.log('Sent:', items[fileName]);
                  }
                });
      });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});