// ====================================================
// SETTING UP THE VARIABLES
// ====================================================
var express     = require('express');
var app 	    = express();
var path 	    = require('path');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');

var server      = require('http').createServer(app);
var io  		= require('socket.io')(server);

//var url         = "mongodb://128.195.54.50/GroupBDB";                  //HUYANH

// =====================================================
// LOADING FUNCTIONALITIES
// ===================================================== 

app.use(express.static(__dirname + '/'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');

server.listen(8173);


// =====================================================
// DATABASE 
// =====================================================
// mongoose.connect(url); // connect to the database                      //HUYANH


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



// ================================================                                      // HUYANH
// io CONNECTION
// ================================================

/*
QUICK COMMENT: I know we have a lot of collections in our database, but I was thinking of having only three:
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

	// variables to use
	var current_user_info = { // This will be = {}, but for testing purposes it is equal to someone already // HUYANH
						      id: "SKJ93878",
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
						      role: ["doctor","admin"]                             // To test the diff roles you 
						      //role: ["trainer"]                                  // uncomment the profile you
						      //role: ["admin"]                                    // want to test and comment the
						      //role: ["patient"]                                  // the current 
						    };

	var current_user_patient_chosen = { // this will be {}, but for testing purposes it is equal to a patient // HUYANH
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


	var current_user_chosen_admin = { // this will be removed completely but here for testing        // HUYANH
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

	// Has a dummy database for now but will be updated later                                          // HUYANH
	var userDatabase = [{id:"d", pass:"1", active: true}, {id:"t", pass:"2", active: true}, {id:"a", pass:"3", active: true}, {id:"p", pass:"4", active: true}];


	client.on('login', function(data){
		var id = data.id;
		var pass = data.pass;
		console.log("=====================================================");
		console.log("Client logging in with . . . . .");
		console.log("user id is " + id + ", password is " + pass);

		/*                                                                                      HUYANH  
		check the database to see if the id and password exist, if they do also check if they are active
		Active means that they have not been 'removed' or deactivated 
		if user not in the database or active is false, then send
		client.emit('UNF', "User not found or deactivated"); 
																							    KRISHNA
		This is where the unhashing of the password would come into play so that you can compare the password
		the user has sent with the one in the database, but this can wait until the database is set up

                                                                                                HUYANH 
		If in the login database then look through the user database and make the current user info 
		variable equal at the user info
		var current_user_info = { 
							      id: "id",
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
							      picture: "filename_id.jpg",
							      role: [ ]
							    };

		and then use we send the role to the client 
		*/
		client.emit('role', {role : current_user_info.role});

	});


	// Doctor is changing whether they have admin privelages or not so sending the new roles
	client.on('toggle', function(data){
		current_user_info.role = data.role;
		console.log("recieved the roles: " + data.role);

		// Go through the user database here and update the role of that user there      // HUYANH
	});


	client.on('update password', function(data){
		console.log('recieved new password: ' + data.new_pass);

		// Go through the login database here and change the password of the user       // HUYANH
		// This is where hashing and the security would go                              // KRISHNA
	});


	client.on('add new patient', function(data){
		console.log('recieved new patient: ' + data.new_patient);

		// Go to the user database here and add this new patient                        // HUYANH
		// But first you will need to see if they are already in the loginDB but 
		// active is false, if so change to true, and then create a makeshift password   // KRISHNA
		// and insert in the password even though they have a password there already
		// You will also need to add them to the doctor's patients list and update
		// the current user info above 
		// Since the current user variable has who is logged in, use that to update 
		// patient list
		// Not sure how to get the patient information, I think this will be
		// connected to the message queue requesting the file for this patient to 
		// be able to update the information in the database 
		// You may have to work with Ashish on this one ????
		// Put the patient but maybe leave all areas blank besides the id of the patient
	});


	client.on('remove patient', function(data){
		console.log('recieved patient to remove: ' + data.remove_patient);

		// Go to the login db and change the active to false                           // HUYANH
		// Based on the current user, if they are a doctor or trainer, then 
		// remove the patient from thier patient's list and update current user
		// variable above 

	});


	client.on('request patient list', function(data){
		console.log(data);

		// Assuming that the current user info variable above is updated with the
		// current user just pass the patients to the client 
		client.emit('sending patient list', {ps: current_user_info.patients});
	});


	client.on('request patient', function(data){
		console.log('client requested patient ' + data.p + ' info');

		// Go to the user database and find, update the variable above with this patient     // HUYANH
		// and send the patient to the client
		// current_user_patient_chosen variable is what is being updated
		client.emit('patient info', current_user_patient_chosen);
	});


	client.on("request current patient", function(data){
		console.log(data);
                                                                                           // ASHISH
		// Will just send the variable above which should contain the user chosen
		// previosly , this will be called if the Client looks at the patients stats 
		// This section is dealing with displaying all of the patients game stats
		// to thier page so this is probably where you would like to work on, or not,
		// up to you because I am not sure what goes on the page still 

		client.emit('patient info', current_user_patient_chosen);
	});


	client.on("database request", function(data){
		console.log(data);

		// Send the client the loginDB                                                   // HUYANH
		client.emit("database sent", userDatabase);
	});


	// This is to be used by either the admin or the doctor admin
	client.on('request user', function(data){
		console.log("client requested user " + data.u + " info");

		// Go to the database and find the user that was requested and send              // HUYANH
		// update the current_user_chosen_admin above
		client.emit("user info", current_user_chosen_admin);
	});


	client.on('add new user', function(data){
		console.log('recieved new user: ' + data.id + " with the role " + data.r);

		// Go to the login db and see if they are already there and change active           // HUYANH
		// to true and give a makeshift password                                            // KRISHNA
		// If not in the loginDB, add them and add password and active then add them
		// to the user database as well 
		// but not sure how to get the user information, I think this will be
		// connected to the message queue requesting the file for this user to 
		// be able to update the information in the database 
		// You may have to work with Ashish on this one 
	});


	client.on('remove user', function(data){
		console.log('recieved user to remove: ' + data.remove_user);

		// Go to the login db here and change active to false                             // HUYANH
		// If it is a patient, then based on the current user, if doctor or trainer,
		// also remove them from their patient list and update current user variable
		// if ONLY admin is current user do nothing just change active to false  

	});


	client.on('prescription', function(data){
		console.log('recieved new prescription ' + data.pres);

		// update the prescription of the patient 
	});


	client.on("request_profile_info", function(data){
		console.log(data);

		// If current user is updated in the variable above then just send the img and the 
		// id
		client.emit('sending profile info',{id: current_user_info.id, img: current_user_info.picture});
	});



}); // end of io.connection


