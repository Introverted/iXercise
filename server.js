// ====================================================
// SETTING UP THE VARIABLES
// ====================================================
var express     = require('express');
var app 	    = express();
var path 	    = require('path');
var bcrypt 		= require('bcryptjs');	
var mongoose    = require('mongoose');
var mongodb     = require("mongodb");
var bodyParser  = require('body-parser');

var server      = require('http').createServer(app);
var io  		= require('socket.io')(server);

var MongoClient = mongodb.MongoClient;
var url         = "mongodb://128.195.54.50/iXerciseDB";                  //HUYANH

// =====================================================
// LOADING FUNCTIONALITIES
// ===================================================== 

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');

server.listen(8173);


// =====================================================
// PAGES TO DISPLAY
// =====================================================
// Get Pages 
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + "/home.html"));
});


// ===========================================================

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

app.post('/change_password.html', function(req, res) {
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


// =====================================================                                     // ASHISH
// MESSAGE QUEUE
// =====================================================
// Since the server will be running all the time I feel like the message queue can go here
// and constantly check for updates on patient stuff and can access the database here and send stuff 
// send data through the io socket to the client html page to dispplay information or something, since
// I am not sure how you actually did the charts



// ================================================                                        // HUYANH
// io CONNECTION
// ================================================

/*
QUICK COMMENT: I know we have a lot of collections in our database, but I was thinking of having only two:
               1. loginDB that will look like the userdatabase variable below and will be used specifically
                  for the login only and for the a couple of functions below, not sure which ones but I 
                  specify
               2. userDB that will contain all of the doctors, trainers, admin, and patients since they 
                  are all part of the system, not sure if that will work since patients have different ip
                  than all the other users, but having them together I feel would be good so that we do not
                  have to check the doctors and if not there then look at trainers, and if not there, then 
                  look at admin, etc. 
*/


// functions
io.on('connection', function (client) {

	// Database variable
	
	MongoClient.connect(url, function(err, db){
		if(err){
			console.log("Unable to connect to the mongodb server. Error: ", err);
		} else {
			console.log("Connection established to ", url);
		}
	
	

	// Dummy Variables that will be removed COMPLETELY once dbs are implemented correctly ///////////////////
	var current_user_info = { // Dummy variables                                                
						      id: "d",
						      uid: "UCI_STUDENT_ID",
						      first_name: "Sarah",
						      middle_name: "K.",
						      last_name: "Johnson",
						      dob: "date_of_birth",
						      gender: "female",
						      office: "XXX building Room 215",
						      email: "asdf@abc.org",
						      contact: "949-123-1234",
						      position: "doctor",
						      title: "Doctor",
						      year_entered: "2015",
						      reports_to: [ {id: "0198475"},  {id: "1726548"} ],
						      patients: [{id: "1234567"}, {id: "89101112"}],
						      picture: "dist/img/user1-128x128.jpg",
						      role: ["doctor","admin"]                             
						      //role: ["trainer"]                                  
						      //role: ["admin"]                                   
						      //role: ["patient"]                                 
						    };



	var current_user_patient_chosen = { // dummy variables                                        
										id: "1234567",
										first_name: "patient_first",
										last_name: "patient_last",
										dob: "date_of_birth",
										gender: "male",
										email: "blah@uci.edu",
										wattage: "100 Watts",
										heart_rate: "150 beats per minute",
										workload: "1hr",
										game: "Minecraft",
										prescription: "something here, something here, something here, and more stuff"
									  };


	var current_user_chosen_admin = { // dummy variables                                            
						      id: "id",
						      uid: "UCI_STUDENT_ID",
						      first_name: "first",
						      middle_name: "middle",
						      last_name: "last",
						      dob: "date_of_birth",
						      gender: "female",
						      office: "XXX building Room 215",
						      email: "asdf@abc.org",
						      contact: "949-123-1234",
						      position: "doctor",
						      title: "Doctor",
						      year_entered: "2015",
						      reports_to: [ {id: "0198475"},  {id: "1726548"} ],
						      patients: [ {id: "1234567"}, {id: "89101112"} ],
						      picture: "filename_id.jpg",
						      role: [ "admin"]
						    };

	// Dummy variables                                                                           
	var userDatabase = [{id:"d", pass:"1", active: true, role: ["doctor", "admin"]}, {id:"t", pass:"2", active: true, role: ["trainer"]}, {id:"a", pass:"3", active: true, role: ["admin"]}, {id:"p", pass:"4", active: true, role: ["patient"]}];
	//////////////////////////////////////////////////////////////////////////////////////////////////////

	client.on('login', function(data){                                                    // FINISHED 
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
		

		//client.emit('role', {role : current_user_info.role });

	});


	// Doctor is changing whether they have admin privelages or not s
	client.on('toggle', function(data){                                                   // FINISHED
		current_user_info.role = data.role;
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


	client.on('update password', function(data){                                            // FINISHED
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


	client.on('update settings', function(data){                                             // HUYANH
		console.log('client ' + data.c + " has sent new: ");  
		console.log('new ucid: ' + data.ucid);
		console.log('new first name: ' + data.fn);
		console.log('new middle name: ' + data.mn);
		console.log('new last name: ' + data.ln);
		console.log('new dob: ' + data.bd);
		console.log('new gender: ' + data.g);
		console.log('new office: ' + data.o);
		console.log('new email: ' + data.e);
		console.log('new contact: ' + data.c);
		console.log('new position: ' + data.pos);
		console.log('new date entered: ' + data.de);
		console.log('new title: ' + data.t);
		console.log('new reports to: ' + data.rt);

		                                                                             
		// Go through database and update the client (data.c), with all of the values that where filled
		// becuase the user may have only updated a couple of things not all of them, check to see if they
		// are empty, skip, if not, then replace value in the clients file
	});


	client.on('update patient settings', function(data){                                    // HUYANH
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
		console.log('new contact: ' + data.c);
		console.log('new date entered: ' + data.d);
		console.log('new primary carer: ' + data.pc);
		console.log('new other carer: ' + data.oc);

		                                                                              
		// Go through database and update the client (data.c), with all of the values that where filled
		// becuase the user may have only updated a couple of things not all of them, check to see if they
		// are empty, skip, if not, then replace value in the clients file
	});


	client.on('add new patient', function(data){                                             // HUYANH
		console.log('recieved new patient: ' + data.new_patient + ' | user: ' + data.user + ' | user role: [' + data.role + ']');

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
		var hashed_gen_pass = bcrypt.hashSync(randGen_pass, bcrypt.genSaltSync(8), null); 
		console.log("rand gen pass: " + hashed_gen_pass);
		

		// Use data.user [id] to find if they are in the login db and check if               
		// active is false, if so change to true, if not in the login db then add them
		// add the randomly created password from the function above 
		// You will also need to add them to the current users patient list if 
		// they are a trainer or a doctor, use data.role to see if trainer or doctor
		// I suggest checking if trainer else doctor
		// leave all of the areas blank except 
		// for the patient id        

	});


	client.on('remove patient', function(data){                                                  // HUYANH
		console.log('recieved patient to remove: ' + data.remove_patient + ' | user: ' + data.user + ' | user role: [' + data.role + ']');

		// Use data.remove_patient to find the patient in the logindb and change          
		// active value to false      
		// then based on the user's role, remove that patient from thier list and
		// remove them from the user database
		// use data.user and data.role                

	});

 
	client.on('request patient list', function(data){                                       // FINISHED                          
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

		//client.emit('sending patient list', {ps: current_user_info.patients});

	});


	client.on('request patient', function(data){                                           // FINISHED 
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

		//client.emit('patient info', current_user_patient_chosen);
	});


	client.on("request current patient", function(data){                                 // FINISHED
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

		//client.emit('patient info', current_user_patient_chosen);
	});


	client.on("database request", function(data){  /////////////////////////// CODING HERE NOT DONE!!!!
		console.log(data);

		// Send the client the loginDB   
		//var loginDB = db.collection("login");                                                // HUYANH
		//console.log("This is what the login db looks like: " + loginDB);
		//client.emit("database sent", loginDB);
		client.emit("database sent", userDatabase);
	});


	// This is to be used by either the admin or the doctor admin
	client.on('request user', function(data){                                             // FINISHED
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

		//client.emit("user info", current_user_chosen_admin);

	});


	// This is to be used by either the admin or the doctor admin
	client.on('add new user', function(data){                                                    // HUYANH
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
		var hashed_gen_pass = bcrypt.hashSync(randGen_pass, bcrypt.genSaltSync(8), null); 
		console.log("rand gen pass: " + hashed_gen_pass);

		// Use data.id (new user id) and see if they are already in the login db and              
		// if they are change the active to true, if not then add them to the               
		// login db and add the randomly created password from the funct above
		// Then add this user to the user database

		// if the client (data.c) is a doctor (check data.cr) and the new user is a 
		// patient (data.r) then add them to thier patient list, if admin, then do nothing. 
		// I suggest checking if they are admin and if not then they are doctor
		// If new user not a patient just add to login and user dbs
		// when adding a new user, leave all of the spaces blank except for the id
	});


	// This is to be used by either the admin or the doctor admin
	client.on('remove user', function(data){
		console.log('recieved user to remove: ' + data.remove_user + " | from client: " + data.c + " with role " + data.cr);

		// Go to the login db here and change active to false                                  // HUYANH
		// If it is a patient, then based on the current user, if doctor or trainer,
		// also remove them from their patient list and update current user variable
		// if ONLY admin is current user do nothing just change active to false  

	});


	client.on('prescription', function(data){                                                   // FINISHED 
		console.log('recieved new prescription ' + data.pres + " for patient " + data.patient);

		// update the prescription (data.pres) of the patient (data.patient)              
		var users_db = db.collection('users');

		users_db.update(
		   { id: data.patient },
		   { $set:
		      {
		        prescription: data.pres
		      }
		   }
		)		

	});


	client.on("request_profile_info", function(data){                                           // FINISHED 
		console.log("Client " + data.c + " is requesting their id and img");
 
		var user_db = db.collection('users');

		user_db.find({id: data.c}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {	
				client.emit('sending profile info',{id: result[0].id, img: result[0].picture});
			} else {

				console.log('No result found with defined "find" criteria!');
				client.emit('UNF', "User not found or deactivated");
			}
		});

		//client.emit('sending profile info',{id: current_user_info.id, img: current_user_info.picture});
	});
 
	// - - - - - - - - - - - - - - - - - - - 

	}); // MongoDB close statement

}); // end of io.connection


