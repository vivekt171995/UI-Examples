// var http = require('http');
// var fs = require('fs');
// var url = require('url');
var express = require('express')
var multer = require('multer');
var mime = require('mime')
var path = require('path')
//const bodyParser = require("body-parser");
var app = express();
var MongoClient = require('mongodb').MongoClient
var db;

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({
    storage: storage
});
app.post('/fileUpload', upload.single('image'), (req, res, next) => {
    // insertDocuments(db, 'public/images/uploads/' + req.file.filename + '.'+ path.extname(req.file.originalname), () => {
    //    // db.close();
    //     res.json({'message': 'File uploaded successfully'});
    // });

    insertDocuments(db, 'public/images/uploads/' + req.file.filename + path.extname(req.file.originalname), () => {
        // db.close();
        res.json({
            'message': 'File uploaded successfully'
        });
    });

});

var insertDocuments = function (db, filePath, callback) {
    var collection = db.collection('fileupload');
    collection.insertOne({
        'imagePath': filePath
    }, (err, result) => {
        //assert.equal(err, null);
        callback(result);
    });
}

MongoClient.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true
}, function (err, client) {
    if (err) throw err

    db = client.db('mydb')

    //   db.collection('users').find().toArray(function (err, result) {
    //     if (err) throw err

    //     console.log(result)
    //   })
})
//app.use(express.bodyParser());
app.use(express.static('public'));
app.use(function (req, res, next) {
    console.log("Date", Date.now());
    next();
})
app.get('/user', function (req, res) {
    db.collection('users').find().toArray(function (err, result) {
        if (err) throw err
        res.send(result)
        console.log(result)
    })
    //  res.send("Get Method called")
});
const bodyParser = require("body-parser");

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post('/user', function (req, res) {
    console.log(req.body)
    // res.send(req)
    db.collection('users').insert(req.body, function (err, result) {
        if (err) throw err
        res.send("Inserted")
        console.log(result)
    })
    // res.send("Post Method called")
});

// app.all('/secret', function (req, res, next) {
//     console.log("Access the secret method");
//     next();
// });
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})