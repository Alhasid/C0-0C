'use strict';

const express = require('express');
var mongo = require('mongodb');
const assert = require('assert');
var path = require ('path');

// Constants
const PORT = 8082;
const HOST = '0.0.0.0';

// App

const app = express();
app.set('view engine', 'pug');
const url = 'mongodb://localhost:27017';
var  data = '';
const MongoClient = mongo.MongoClient;
const agg = [{'$sample': {'size': 1}}];
app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    
    MongoClient.connect(url, function(err, db) {

        var dbo = db.db('music').collection('musicspot');

        dbo.aggregate(agg, (cmdErr, result) => {
            assert.equal(null, cmdErr);
                result.forEach(result => {
                data = `${result.spoturi}`;
                res.render('../views/index', { testObj: data});
            });
            
        });

        db.close();
    }) 
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);