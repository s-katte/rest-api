const express = require('express');
const routes = require('./routes/api.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//setup express app
const app = express();


//connect to db
mongoose.connect('mongodb://localhost/ninjago', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.Promise = global.Promise;


app.use(bodyParser.json());

//initialoze routes
app.use('/api',routes);


//error handling middleware
app.use(function(err, req, res, next) {
	// console.log(err);
	res.status(422).send({error: err.message});
});

//listen for requests
app.listen(process.env.port || 4000, function() {
	console.log("now listening for request");
});