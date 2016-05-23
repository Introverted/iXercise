// Var to connect to the server
//var socket = io.connect('http://128.195.54.50:8173/');
//var socket = io.connect('http://0.0.0.0:8173/');
var socket = io.connect();

// This function is for when the user logs in, it will take them to the correct page
$(function(){

	$('#login-form').submit(function() {

		// Pass the user id and the password to the server
	  	var userid = $("#lg_id").val();
		var userpass = $("#lg_password").val();

		socket.emit('login', {id: userid, pass: userpass});

		socket.on('role', function(data){
			
			if ($.inArray('doctor', data.role) != -1){ 
			    localStorage.setItem("role", JSON.stringify(data.role));
			    localStorage.setItem("userid", JSON.stringify(userid)); 

				document.location.href='mainD.html'; 
			} 
		    else if ($.inArray('trainer', data.role) != -1){ 
		    	localStorage.setItem("role", JSON.stringify(data.role));
		    	localStorage.setItem("userid", JSON.stringify(userid));

		    	document.location.href='mainT.html'; 
		    }
		    else if ($.inArray('admin', data.role) != -1){ 
		    	localStorage.setItem("role", JSON.stringify(data.role));
		    	localStorage.setItem("userid", JSON.stringify(userid));

		    	document.location.href='userList.html'; 
		    } 
		    else if ($.inArray('patient', data.role) != -1){ 
		    	localStorage.setItem("role", JSON.stringify(data.role));
		    	localStorage.setItem("userid", JSON.stringify(userid));

		    	document.location.href='patientProfileP.html'; 
		    } 			
		}); // socket

		socket.on('UNF', function(data){ // USER NOT FOUND
		  	alert("incorrect id or password");
		});

	});

});



// This is all of the functions in the patientList page for the trainers and doctors
$(function(){

	// DOCTOR
    // code when user presses the add patient button
    $( "#add_patient_buttonD" ).click(function() { 
        var np = $('#new_patient_id').val();
        socket.emit('add new patient', {new_patient: np, user: JSON.parse(localStorage.getItem('userid')), role: JSON.parse(localStorage.getItem('role'))});
        document.location.href='patientListD.html';
	});

    // code when user presses the remove button
    $( "#remove_patient_buttonD" ).click(function() { 
        var rp = $('#remove_patient_id').val();
        socket.emit('remove patient',{remove_patient: rp, user: JSON.parse(localStorage.getItem('userid')), role: JSON.parse(localStorage.getItem('role'))});
        document.location.href='patientListD.html';
	});

	// TRAINER
    // code when user presses the add patient button
    $( "#add_patient_buttonT" ).click(function() { 
        var np = $('#new_patient_id').val();
        socket.emit('add new patient', {new_patient: np, user: JSON.parse(localStorage.getItem('userid')), role: JSON.parse(localStorage.getItem('role'))});
        document.location.href='patientListT.html';
	});

    // code when user presses the remove button
    $( "#remove_patient_buttonT" ).click(function() { 
        var rp = $('#remove_patient_id').val();
        socket.emit('remove patient',{remove_patient: rp, user: JSON.parse(localStorage.getItem('userid')), role: JSON.parse(localStorage.getItem('role'))});
        document.location.href='patientListT.html';
	});

});


// Patient page edit prescription
$(function(){

	$('.save-patient_profile-info').click(function() {

		var prescri = $('#p_presc').val();
		//var treate = $('#p_treat).val();

		if (prescri != ""){
			socket.emit('prescription', {pres: prescri, patient: JSON.parse(localStorage.getItem('patient'))});
		}
		//if (treate != ""){
		//	socket.emit('treatement', {tre: treate});
		//}

	});

});


// on signout
$(function(){

	$("#signout").click(function(){
		localStorage.clear();
		document.location.href='loginScreen.html';			
	});

});
