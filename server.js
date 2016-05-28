// =====================================================================================
// SETTING UP THE VARIABLES
// =====================================================================================

// General variables
var express     = require('express');
var app 	    = express();
var path 	    = require('path');
var bcrypt 		= require('bcryptjs');	
var mongoose    = require('mongoose');
var mongodb     = require("mongodb");
var bodyParser  = require('body-parser');

// Socket variables
var server      = require('http').createServer(app);
var io  		= require('socket.io')(server);

// Database variables
var MongoClient = mongodb.MongoClient;
var url         = "mongodb://128.195.54.50/iXerciseDB";                  

// Send email variables
var nodemailer    = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var options       = {
		service : "gmail",
		auth: {
			user: "ixercisesystem@gmail.com",
			pass: "webapplication"
		}
	};

var transporter   = nodemailer.createTransport(smtpTransport(options));



// =====================================================================================
// LOADING FUNCTIONALITIES
// =====================================================================================

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');

server.listen(8173);




// =====================================================================================
// PAGES TO DISPLAY
// =====================================================================================

// Get Pages 
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + "/home.html"));
});

// -------------------------------------------------------------------------------------

// Post Pages
app.post('/loginScreen.html', function(req, res) {
	//res.sendFile(path.join(__dirname + "/loginScreen.html"));
});

app.post('/mainD.html', function(req, res) {
	//res.sendFile(path.join(__dirname + "/mainD.html"));
});

app.post('/mainT.html', function(req, res) {
	// stuff here if needed
});

app.post('/userList.html', function(req, res) {
	// stuff here if needed
});

app.post('/patientProfileP.html', function(req, res) {
	// stuff here if needed
});

app.post('/patientProfileD.html', function(req, res) {
	// stuff here if needed
});

app.post('/patientProfileT.html', function(req, res) {
	// stuff here if needed
});

app.post('/admin_doctor.html', function(req, res) {
	// stuff here if needed
});

app.post('/edit_settings.html', function(req, res) {
	// stuff here if needed
});

app.post('/edit_settings_p.html', function(req, res) {
	// stuff here if needed
});

app.post('/home.html', function(req, res) {
	// stuff here if needed
});

app.post('/patientListD.html', function(req, res) {
	// stuff here if needed
});

app.post('/patientListT.html', function(req, res) {
	// stuff here if needed
});



// =====================================================================================      
// io CONNECTION & FUNCTIONS
// =====================================================================================

io.on('connection', function (client) {

	// -------------------------------------------------------------------------------- MONGO CONNECTION

	MongoClient.connect(url, function(err, db){
		if(err){
			console.log("Unable to connect to the mongodb server. Error: ", err);
		} else {
			console.log("Connection established to ", url);
		}
	

	// -------------------------------------------------------------------------------- LOGIN

	client.on('login', function(data){                                                
		var id = data.id;
		var pass = data.pass;
		console.log("=====================================================");

		
		// Accessing the database to find the user 
		var login_col = db.collection('login');

		login_col.find({id:id}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {	

				// Unhash password and compare with password client wrote and see if they are
				// currently active in the system 
				if(bcrypt.compareSync(data.pass, result[0].pass) && result[0].active == true){	
					console.log("Client logging in with . . . . .");
					console.log("user id is " + id + ", password is " + pass);
					client.emit('role', {role : result[0].role});

				} else {
					client.emit('UNF', "User not found or deactivated");
				}

			} else {

				console.log('No result found with defined "find" criteria!');
				client.emit('UNF', "User not found or deactivated");
			}
		});
		
		
	});


	// -------------------------------------------------------------------------------- TOGGLE ADMIN FUNCT


	// Doctor is changing whether they have admin privelages or not s
	client.on('toggle', function(data){                                                   
		console.log("recieved the roles: [" + data.role + "] | user: " + data.user);

		// Changing roles in the login db
		var login_db = db.collection('login');

		login_db.update(
		   { id: data.user },
		   { $set:
		      {
		        role: data.role
		      }
		   }
		)

	});


	// -------------------------------------------------------------------------------- UPDATE PASSWORD 


	client.on('update password', function(data){                                            
		console.log('recieved new password: ' + data.new_pass + ' | user: ' + data.user);

		// This hashes new password client has inputted
		var hash_pass = bcrypt.hashSync(data.new_pass, bcrypt.genSaltSync(8), null);

		var login_db = db.collection('login');

		login_db.update(
		   { id: data.user },
		   { $set:
		      {
		        pass: hash_pass
		      }
		   }
		)

	});


	// -------------------------------------------------------------------------------- UPDATE USER SETTINGS


	client.on('update settings', function(data){                                             
		console.log('client ' + data.c + " has sent new: ");  
		console.log('new ucid: ' + data.ucid);
		console.log('new first name: ' + data.fn);
		console.log('new middle name: ' + data.mn);
		console.log('new last name: ' + data.ln);
		console.log('new dob: ' + data.bd);
		console.log('new gender: ' + data.g);
		console.log('new office: ' + data.o);
		console.log('new email: ' + data.e);
		console.log('new contact: ' + data.cn);
		console.log('new position: ' + data.pos);
		console.log('new date entered: ' + data.de);
		console.log('new title: ' + data.t);
		console.log('new reports to: ' + data.rt);

		var user_db = db.collection("users");

		if (data.ucid != ""){
			user_db.updatel(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			uid : data.ucid
		      		}
		   		}
			)
		} 
		if (data.fn != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		   				first_name : data.fn
		   			}
		   		}
			)
		} 
		if (data.mn != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			middle_name : data.mn
		      		}
		   		}
			)
		} 
		if (data.ln != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			last_name : data.ln
		      		}
		   		}
			)
		} 
		if (data.bd != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			dob : data.bd
		      		}
		   		}
			)
		} 
		if (data.g != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			gender : data.g
		      		}
		   		}
			)	
		} 
		if (data.o != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			office : data.o
		      		}
		   		}
			)	
		} 
		if (data.e != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			email : data.e
		      		}
		   		}
			)	
		} 
		if (data.cn != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			contact : data.cn
		      		}
		   		}
			)
		} 
		if (data.pos != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{	
		      			position : data.pos
		      		}
		   		}
			)
		} 
		if (data.de != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			year_entered : data.de
		      		}
		   		}
			)
		} 
		if (data.t != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			title : data.t
		      		}
		   		}
			)	
		} 
		if (data.rt != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			reports_to : [data.rt] // Will need to loop though this and make it look like {id: blah, id: blah}
		      		}
		   		}
			)
		} 

	});


	// -------------------------------------------------------------------------------- UPDATE PATIENT SETTINGS


	client.on('update patient settings', function(data){                                   
		console.log('client ' + data.c + " has sent new: ");
		console.log('new ucid: ' + data.ucid);
		console.log('new first name: ' + data.fn);
		console.log('new middle name: ' + data.mn);
		console.log('new last name: ' + data.ln);
		console.log('new dob: ' + data.bd);
		console.log('new gender: ' + data.g);

		console.log('new address_01: ' + data.a1);
		console.log('new address_02: ' + data.a2);
		console.log('new city: ' + data.cy);
		console.log('new state: ' + data.st);
		console.log('new zip: ' + data.zp);

		console.log('new email: ' + data.e);
		console.log('new contact: ' + data.co);
		console.log('new date entered: ' + data.d);
		console.log('new primary carer: ' + data.pc);
		console.log('new other carer: ' + data.oc);

		var user_db = db.collection("users");

		if (data.ucid != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			uid : data.ucid
		      		}
		   		}
			)
		} 
		if (data.fn != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			first_name : data.fn
		      		}
		   		}
			)
		} 
		if (data.mn != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			middle_name : data.mn
		      		}
		   		}
			)
		} 
		if (data.ln != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			last_name : data.ln
		      		}
		   		}
			)
		} 
		if (data.db != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			dob : data.db
		      		}
		   		}
			)
		} 
		if (data.g != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			gender : data.g
		      		}
		   		}
			)
		} 
		if (data.a1 != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			"address.address_01" : data.a1
		      		}
		   		}
			)
		} 
		if (data.a2 != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			"address.address_02" : data.a2
		      		}
		   		}
			)
		} 
		if (data.cy != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			"address.city" : data.cy
		      		}
		   		}
			)
		} 
		if (data.st != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			"address.state" : data.st
		      		}
		   		}
			)
		} 
		if (data.zp != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			"address.zip" : data.zp
		      		}
		   		}
			)
		} 
		if (data.e != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			email : data.e
		      		}
		   		}
			)
		} 
		if (data.co != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			contact : data.co
		      		}
		   		}
			)
		} 
		if (data.d != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			date_entered : data.d
		      		}
		   		}
			)
		} 
		if (data.pc != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			primary_carer : data.pc
		      		}
		   		}
			)
		} 
		if (data.oc != ""){
			user_db.update(
		   		{ id: data.c },
		   		{ $set:
		   			{
		      			other_carer : data.oc
		      		}
		   		}
			)
		} 

	});

 
 	// -------------------------------------------------------------------------------- UPLOAD IMAGE
 	client.on('sending img', function(data){
 		console.log("Client " + data.c + " has sent an img");

 		var user_db = db.collection("users");

		user_db.update(
		   	{ id: data.c },
		   	{ $set:
		   		{
		      		picture : data.img
		      	}
		   	}
		)

 	});


	// -------------------------------------------------------------------------------- REQUEST PATIENT LIST


	client.on('request patient list', function(data){                                                                
		console.log(data.user + ' has requested their patient list');                   

		var user_db = db.collection('users');

		user_db.find({id: data.user}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {	
				client.emit('sending patient list', {ps: result[0].patients});
			} else {

				console.log('No result found with defined "find" criteria!');
				client.emit('UNF', "User not found or deactivated");
			}
		});

	});


	// -------------------------------------------------------------------------------- REqUEST PATIENT


	client.on('request patient', function(data){                                           
		console.log('client requested patient ' + data.p + ' info');

		var user_db = db.collection('users');

		user_db.find({id: data.p}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {	
				client.emit('patient info', result[0]);
			} else {

				console.log('No result found with defined "find" criteria!');
				client.emit('UNF', "User not found or deactivated");
			}
		});
	});


	// -------------------------------------------------------------------------------- REQUEST CURRENT PATIENT


	client.on("request current patient", function(data){                                    
		console.log("Client has requested " + data.patient +"'s info");

		var user_db = db.collection('users');

		user_db.find({id: data.patient}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {	
				client.emit('patient info', result[0]);
			} else {

				console.log('No result found with defined "find" criteria!');
				client.emit('UNF', "User not found or deactivated");
			}
		});
	});


	// -------------------------------------------------------------------------------- REQUEST DATABASE


	client.on("database request", function(data){  
		console.log(data);

		// Send the client the loginDB   
		var user_db = db.collection("users"); 
	
		user_db.count({}, function(err, num){
			var userList = [];
			var dbCount = 0;

			user_db.find().forEach(function(data){

				userList.push({id: data.id, r: data.role});
				dbCount++;	

				if (dbCount == num){
					client.emit("database sent", userList);
				}

			});
		});
	});


	// -------------------------------------------------------------------------------- REQUEST USER


	// This is to be used by either the admin or the doctor admin
	client.on('request user', function(data){                                                  
		console.log( data.c + " requested user " + data.u + " info");

		var user_db = db.collection('users');

		user_db.find({id: data.u}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {	
				client.emit("user info", result[0]);
			} else {

				console.log('No result found with defined "find" criteria!');
				client.emit('UNF', "User not found or deactivated");
			}
		});

	});


	// -------------------------------------------------------------------------------- ADD NEW USER


	// This is to be used by either the admin or the doctor admin
	client.on('add new user', function(data){                                                    
		console.log('recieved new user: ' + data.id + " with the role " + data.r + " | from client: " + data.c + " with role " + data.cr);

		// This randomly generates password that will be put for the new patient
		function generatePassword() {
		    var length = 8,
		        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		        retVal = "";
		    for (var i = 0, n = charset.length; i < length; ++i) {
		        retVal += charset.charAt(Math.floor(Math.random() * n));
		    }
		    return retVal;
		}

		// This is the random;y created password
		var randGen_pass = generatePassword();  //Will need to send this to the patient somehow
		console.log("new password: " + randGen_pass);
		var hashed_gen_pass = bcrypt.hashSync(randGen_pass, bcrypt.genSaltSync(8), null); 


		var user_login = {
			id: data.id,
			pass: hashed_gen_pass,
			role: [data.r],
			active: true
		};


		var user = {                                        
			id : data.id,
		    uid: " ",
			first_name: " ",
		    middle_name: " ",
		    last_name: " ",
			dob: " ",
			gender: " ",
			office: " ",
			email: data.e,
			contact: " ",
			position: " ",
			title: " ",
			year_entered: " ",
			reports_to: [ ],
			patients: [ ],
			picture: " ",
			role: [data.r]
		};

		var patient = {
			id: data.id,
			uid: " ",
			title: " ",
			first_name: " ",
			middle_name: " ",
			last_name: " ",
			dob: " ",
			gender: " ",
			address: {
				address_01: " ",
				address_02: " ",
				city: " ",
				state: " ",
				zip: " "
			},
			email: data.e,
			contact: " ",
			date_entered: " ",
			primary_carer: "",
			other_carer: " ",
			diagnosis: [ ],
			progress: [ ],
			picture: " ",
			role: [data.r],
			threshold: {high: "0", low: "0"}
		};


		var login_db = db.collection("login");
		var user_db = db.collection("users");


		// Add to login or change to active 
		login_db.find({id: data.id}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {	
				login_db.update(
				    { id: data.id },
				    { $set: 
				    	{ 
				    		active: true,
				    		pass : hashed_gen_pass
				    	} 
				    }
				)
			} else {
				login_db.insert(user_login);
			}
		});



		// Add to the user db using appropriate var [patient or user]
		if (data.r == "patient"){
			user_db.insert(patient);
		} else {
			user_db.insert(user);
		}

		// If the user is a doctor and the new user is a patient add them to the doctor's  
		// patient list
		if (data.cr != "admin" && data.r == "patient"){

			user_db.update(
				{id: data.c},
				{$addToSet://$push: 
					{
						patients: {id: data.id} 
					} 
				}
			)
		}


	  // setup e-mail data with unicode symbols
	  	var mailOptions = {
		   from: "iXercise System <ixercisesystem@gmail.com>", // sender address.  Must be the same as authenticated user if using Gmail.
		   to: "<" + data.e +">", // receiver
		   subject: "You Have Been Registered to the iXercise System!", // subject
		   html: "<p>Hello new user, <br> You have been registered to have an account in the iXercise System. <br><br> Your login information is: <br>id: " + data.id + '<br>pass: ' + randGen_pass + '<br><br> Please update your password at your own convenience. <br><br> Have a nice day! <br> From the iXercise System Team </p>' // body
		};
	

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        console.log("Message sent: " + response.message);
		    }

		    transporter.close(); // shut down the connection pool, no more messages
		});



	});


	// -------------------------------------------------------------------------------- REMOVE USER


	// This is to be used by either the admin or the doctor admin
	client.on('remove user', function(data){                                                   
		console.log('recieved user to remove: ' + data.remove_user + " | from client: " + data.c + " with role " + data.cr);

		var login_db = db.collection("login");
		var user_db = db.collection('users');

		// Remove user from user db
		user_db.remove({id: data.remove_user}); 

		// Make active false
		login_db.find({id: data.remove_user}).toArray(function(err, result){ 
			if(err){
				console.log(err);
			} else if (result.length) {	

				login_db.update(
					{ id: data.remove_user },
					{$set:
						{
							active: false
						}
					}
				)

				// Remove the patient from the doctors list if patient and user is a doctor 
				if(result[0].role == "patient" && data.cr != "admin"){
					user_db.update(
						{ id: data.c },
						{$pull:
							{
								patients: {id: data.remove_user}
							}
						}
					)
				}

			} else {
				console.log('No result found with defined "find" criteria!');
				client.emit('UNF', "User not found or deactivated");
			}
		});
		
	});


	// -------------------------------------------------------------------------------- DOCTOR UPDATE PATIENT INFO


	client.on('prescription', function(data){                                                  
		console.log('recieved new prescription ' + data.pres + " for patient " + data.patient);
		console.log('recieved high threshold ' + data.h + " for patient " + data.patient);
		console.log('recieved low threshold ' + data.l + " for patient " + data.patient);

		            
		var users_db = db.collection('users');

		if (data.pres != ""){
			users_db.update(
			   { id: data.patient },
			   { $set:
			      {
			        prescription: data.pres
			      }
			   }
			)
		}
		if (data.h != ""){
			users_db.update(
				{id: data.patient},
				{$set: 
					{
						"threshold.high": data.h
					} 
				}
			)
		}
		if (data.l != ""){
			users_db.update(
				{id: data.patient},
				{$set: 
					{
						"threshold.low": data.l
					} 
				}
			)
		}		

	});


	// -------------------------------------------------------------------------------- REQUEST PROFILE INFO


	client.on("request_profile_info", function(data){                                           
		console.log("Client " + data.c + " is requesting their id and img");
 
		var user_db = db.collection('users');

		user_db.find({id: data.c}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {	
				client.emit('sending profile info',{fn: result[0].first_name, ln: result[0].last_name, img: result[0].picture});
			} else {

				console.log('No result found with defined "find" criteria!');
				client.emit('UNF', "User not found or deactivated");
			}
		});

	});
 

	// --------------------------------------------------------------------------------


	}); // MongoDB close statement

}); // end of io.connection


