/**
 * Created by huyanh on 2016. 5. 17..
 */
var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
    address: {
        address_01: String,
        address_02: String,
        city: String,
        state: String,
        zip: String
    }
})

var userSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    uid: {type: String, unique: true, minlength: 8, maxlength: 8},
    title: String,
    first_name: String,
    middle_name: String,
    last_name: String,
    dob: String,
    gender: String,
    address: addressSchema,
    email: String,
    contact: String,
    position: String,
    date_entered: String,
    reports_to: [String],
    primary_career: String,
    other_career: String,
    diagnosis: [String], // [ {id: "diagnosisID"}, {id: "diagnosisID"} ] diagnosis primary key
    progress: [String], // [ {id: "progressID"}, {id: "progressID"} ] progress primary key
    picture: String // jpg
});