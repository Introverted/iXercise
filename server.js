// ====================================================
// SETTING UP THE VARIABLES
// ====================================================
var express     = require('express');
var app 	    = express();
var path 	    = require('path');
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

                  You can do this however you want, if it does not work out this way.
                  Please place comments as you go refering to which collection you are accessing, EXAMPLE

                  client.on('login') blah blah . . .
                  // accessing the loginDB 

                  put it below so that other who may need to look at it or something will know
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
	

	// variables to use
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
						      //role: ["doctor","admin"]                             
						      //role: ["trainer"]                                  
						      //role: ["admin"]                                   
						      role: ["patient"]                                 
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

	// Dummy variables                                                                           // HUYANH
	var userDatabase = [{id:"d", pass:"1", active: true}, {id:"t", pass:"2", active: true}, {id:"a", pass:"3", active: true}, {id:"p", pass:"4", active: true}];

	// VARIABLES THAT WILL ACTUALLY BE USED BELOW WITH THE DATABASES

	client.on('login', function(data){
		var id = data.id;
		var pass = data.pass;
		console.log("=====================================================");

		/*                                                                                      
																							    KRISHNA
		This is where the unhashing of the password would come into play so that you can compare the password
		the user has sent with the one in the database, but this can wait until the database is set up

		*/

		
		// Accessing the database to find the user 
		var login_col = db.collection('login');

		login_col.find({$and: [{id:id},{pass: pass}]}).toArray(function(err, result){
			if(err){
				console.log(err);
			} else if (result.length) {				
				if(result[0].active == true){
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


		// Doctor is changing whether they have admin privelages or not so sending the new roles
	client.on('toggle', function(data){
		current_user_info.role = data.role;
		console.log("recieved the roles: [" + data.role + "] | user: " + data.user);

		// Go through the user database here and update the role of that user there      // HUYANH
		// data.user is the id of the current user that is logged in
	});


	client.on('update password', function(data){
		console.log('recieved new password: ' + data.new_pass + ' | user: ' + data.user);

		// Go through the login database here and change the password of the user       // HUYANH
		// Use data.user which is the user id and find that person
		// This is where hashing and the security would go                              // KRISHNA
		// Use data.new_pass and hash it 
		// After the new pass has been hashed replace old pass with the new one         // HUYANH

	});


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
		console.log('new contact: ' + data.c);
		console.log('new position: ' + data.pos);
		console.log('new date entered: ' + data.de);
		console.log('new title: ' + data.t);
		console.log('new reports to: ' + data.rt);

		// Go through database and update the client (data.c), with all of the values that where filled
		// becuase the user may have only updated a couple of things not all of them, check to see if they
		// are empty, skip, if not, then replace value in the clients file
	});


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
		console.log('new contact: ' + data.c);
		console.log('new date entered: ' + data.d);
		console.log('new primary carer: ' + data.pc);
		console.log('new other carer: ' + data.oc);

		// Go through database and update the client (data.c), with all of the values that where filled
		// becuase the user may have only updated a couple of things not all of them, check to see if they
		// are empty, skip, if not, then replace value in the clients file
	});


	client.on('add new patient', function(data){
		console.log('recieved new patient: ' + data.new_patient + ' | user: ' + data.user + ' | user role: [' + data.role + ']');

		// Use data.user [id] to find if they are in the login db and check if               // HUYANH
		// active is false, if so change to true, if not in the login db then add them
		// create a random password generator                                               // KRISHNA
		// update the password                                                              // HUYANH
		// You will also need to add them to the current users patient list if 
		// they are a trainer or a doctor, use data.role to see if trainer    

		// if not in the login db then add them in there                                    // HUYANH
		// create a password here                                                           // KRISHNA
		// update the password                                                              // HUYANH
		// Not sure how to get the patient information, I think this will be
		// When creating a new patient, leave all of the areas blank except 
		// for the patient id
	});


	client.on('remove patient', function(data){
		console.log('recieved patient to remove: ' + data.remove_patient + ' | user: ' + data.user + ' | user role: [' + data.role + ']');

		// Use data.remove_patient to find the patient in the logindb and change          // HUYANH
		// active value to false      
		// then based on the user's role, remove that patient from thier list and
		// remove them from the user database
		// use data.user and data.role                

	});


	client.on('request patient list', function(data){                                    
		console.log(data.user + ' has requested their patient list');

		// Use data.user (id) to find the user in the database and get their patient        // HUYANH
		// list and send the list to the client 
		client.emit('sending patient list', {ps: current_user_info.patients});
	});


	client.on('request patient', function(data){
		console.log('client requested patient ' + data.p + ' info');

		// use data.p (id) to find patient in the user db and send the patient              // HUYANH
		// info to the client

		client.emit('patient info', current_user_patient_chosen);
	});


	client.on("request current patient", function(data){
		console.log("Client has requested " + data.patient +"'s info");
                                                                                           // ASHISH
		// use data.patient (id) to find the patient in the user db
		// to grab their info 

		client.emit('patient info', current_user_patient_chosen);
	});


	client.on("database request", function(data){
		console.log(data);

		// Send the client the loginDB                                                   // HUYANH
		client.emit("database sent", userDatabase);
	});


	// This is to be used by either the admin or the doctor admin
	client.on('request user', function(data){
		console.log( data.c + " requested user " + data.u + " info");

		// Go to the database and find the user that was requested and send              // HUYANH
		// update the current_user_chosen_admin above
		client.emit("user info", current_user_chosen_admin);
	});


	// This is to be used by either the admin or the doctor admin
	client.on('add new user', function(data){
		console.log('recieved new user: ' + data.id + " with the role " + data.r + " | from client: " + data.c + " with role " + data.cr);

		// Use data.id (new user id) and see if they are already in there and               // HUYANH
		// if they are change the active to true, if not then add them to the               // KRISHNA
		// login db and make a new password for them
		// Then add this user to the user database

		// if the client (data.c) is a doctor (check data.cr) and the new user is a 
		// patient then add them to thier patient list, if admin, then do nothing. 
		// I suggest checking if they are admin and if not then they are doctor, since 
		// a doctor can have multiple roles and you would have to check to see if in those 
		// multiple roles, doctor is in there, while admin is just admin
		// If new user not a patient just add to login and user dbs
		// when adding a new user, leave all of the spaces blank except for the id
	});


	// This is to be used by either the admin or the doctor admin
	client.on('remove user', function(data){
		console.log('recieved user to remove: ' + data.remove_user + " | from client: " + data.c + " with role " + data.cr);

		// Go to the login db here and change active to false                             // HUYANH
		// If it is a patient, then based on the current user, if doctor or trainer,
		// also remove them from their patient list and update current user variable
		// if ONLY admin is current user do nothing just change active to false  

	});


	client.on('prescription', function(data){
		console.log('recieved new prescription ' + data.pres + " for patient " + data.patient);

		// update the prescription (data.pres) of the patient (data.patient)              // HUYANH
	});


	client.on("request_profile_info", function(data){
		console.log("Client " + data.c + " is requesting their id and img");
 
		// Get clients (data.c) and give client their id and img                         // HUYANH

		client.emit('sending profile info',{id: current_user_info.id, img: current_user_info.picture});
	});
 
	// - - - - - - - - - - - - - - - - - - - 

	}); // MongoDB close statement

}); // end of io.connection


