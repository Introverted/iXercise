/**
 * Created by huyanh on 2016. 5. 16..
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    uid: {type: String, unique: true, minlength: 8, maxlength: 8},
    first_name: String,
    middle_name: String,
    last_name: String,
    dob: String,
    gender: String,
    office: String,
    email: String,
    contact: String,
    position: String,
    title: String,
    year_entered: String,
    reports_to: [String],
    patients: [String],
    picture: String,
    role: [String] // example roles: [ "admin", "representative", "trainer", "patient_manager" ]
});