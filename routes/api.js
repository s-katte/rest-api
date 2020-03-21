const express = require('express');
const router = express.Router();
const Ninja = require('./../models/ninja');
const path = require("path");


router.get('/', function(req, res, next) {
	res.render('home');
});

// router.get('/find/ninjas', function(req, res, next) {
// 	res.render('find')
// });

//get a list of ninjas from db
router.get('/find/ninjas', function(req, res, next) {
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
		).then(function(results){ res.render('find',{data: {ninja: results}}); 
});
	} else {
		res.render('find');
	}

	// Ninja.geoNear(
	// 		{type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
	// 		{maxDistance: 100000, spherical: true}
	// 	).then(function(ninjas) {
	// 		res.send(ninjas);
	// 	});
});

router.get("/add", function(req, res, next) {
	res.render("add");
});

// add a new ninja to db
router.post('/add', function(req, res, next) {
	// var ninja = new Ninja(req.body);
	// ninja.save();	//save to db
	console.log(req.body);
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

router.get('/delete', function(req, res, next) {
	res.render('delete');
});

//delete a ninja form db
router.delete('/ninjas/:id', function(req, res, next) {
	Ninja.findByIdAndRemove({_id: req.params.id}).then(function(ninja) {
		res.send(ninja);
	});
	res.send({type: 'DELETE'});
});

module.exports = router;