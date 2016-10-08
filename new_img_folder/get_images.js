var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var fs = require('fs');

// Connection URL
var url = 'mongodb://localhost:27017/test';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  findDocuments(db, function(docs){
    console.log('inside callback');
    db.close();
  });
});

var findDocuments = function(db, callback) {
  // Get the compounds collection
  var collection = db.collection('compounds');
  // Find some compounds
  collection.find({}).toArray(function(err, docs) {
    // write each document to a new file in the current directory
    docs.forEach(function(doc){
        var imageBuffer = new Buffer(doc.formula_img, 'base64');
        fs.writeFile(doc.name+'.png', imageBuffer, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    });
    callback(docs);
  });
}