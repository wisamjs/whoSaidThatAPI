//Packages
//--------------------------------------
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to our database
mongoose.connect(process.env.MONGODB_URL);
var Person = require('./models/person');



//configure app to use bodyParser()
// this will let us get the data from a POST

app.use(bodyParser());
var port = process.env.PORT || 8080;

//Routing
var router = express.Router();

router.use(function(req, res, next){
	
	console.log('Something is happening: ');
	next(); //make sure we go to the next routes and don't stop here
});

router.get('/',function(req,res){
	res.json({'message':'welcome to our api'});
	
});

//============
router.route('/persons')

	//add a person
	.post(function(req, res){
		var person = new Person();
		person.name = req.body.name;
		person.email = req.body.email;

		//save person and check for errors

		person.save(function(err){
			if (err){
				res.send(err);
			}

			res.json({ message: 'Person created'});

		});
	})

	//get all persons
	.get(function(req,res){
		Person.find(req, function(err,person){
			if (err)
			res.send(err);

		res.json(person);
		console.log(person);
		console.log(Person);

		});


	});

	router.route('/persons/:person_id')
	//get by id
	.get(function(req, res){
		Person.findById(req.params.person_id, function(err,person){
			if (err)
				res.send(err);

			res.json(person);
		});
	})

	.put(function(req,res){
		Person.findById(req.params.person_id,function(err,person){
			if (err)
				res.send(err);

			//renaming person's name
			person.name = req.body.name;

			//saving person

			person.save(function(err){
				if (err)
					res.send(err);
				res.json({message: 'Person updated'});
			});
		});
	})

	.delete(function (req, res){
		Person.remove({
			_id:req.params.person_id
		}, function(err,person){
			if (err)
				res.send(err);
			res.json({message : 'successfully deleted'});
		});

	});


	router.route('/persons?email=:email')
		.get(function(req, res){
		Person.findById(req.params.email, function(err,person){
			if (err)
				res.send(err);

			res.json(person);
		});
	})


// Register our routes
//====================
app.use('/api', router);

//Start the server
//===============

app.listen(port);
console.log('Listening to port: ' + port + process.env.MONGODB_URL);