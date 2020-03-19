const express = require('express');
const router = express.Router();
const Ninja = require('./../models/ninja');
const path = require("path");


router.get('/', function(req, res, next) {
	res.sendFile("index.html", {root: "./public/"})
});

router.get('/find/all', function(req, res, next) {
	Ninja.find({}).then(function(results) {
		res.sendFile("find.html?res="+results, {root: "./public/"})
	});

});

//get a list of ninjas from db
router.get('/ninjas', function(req, res, next) {
	// Ninja.find({}).then(function(ninjas) {
	// 	res.send(ninjas);
	// })

	if(req.query.lng != null) {
		Ninja.aggregate(
			[
				{ $geoNear: 
					{ 
						near: {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]}, 
						spherical: true, maxDistance: 30000, distanceField: "dist.calculated" 
					} 
				}
			]
		).then(function(results){ res.send(results); });
	} else if(req.query.name != null) {
		Ninja.find({}).then(function(results) { res.send(results); });
	}

	// Ninja.geoNear(
	// 		{type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
	// 		{maxDistance: 100000, spherical: true}
	// 	).then(function(ninjas) {
	// 		res.send(ninjas);
	// 	});
});

// add a new ninja to db
router.post('/ninjas', function(req, res, next) {
	// var ninja = new Ninja(req.body);
	// ninja.save();	//save to db

//save to db another method
	Ninja.create(req.body).then(function(ninja) {
		res.send(ninja);
	}).catch(next);
});

//update a ninja in db
router.put('/ninjas/:id', function(req, res, next) {
	Ninja.findByIdAndUpdate({_id: req.params.id}, req.body).then(function() {
		Ninja.findOne({_id: req.params.id}).then(function(ninja){
			res.send(ninja);
		});
	});
	// res.send({type: 'PUT'});
});

//delete a ninja form db
router.delete('/ninjas/:id', function(req, res, next) {
	Ninja.findByIdAndRemove({_id: req.params.id}).then(function(ninja) {
		res.send(ninja);
	});
	res.send({type: 'DELETE'});
});

module.exports = router;