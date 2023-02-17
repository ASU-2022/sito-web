const mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('studente', new Schema({
	nome:String,
    cognome:String,
    matricola:Number,
    data_nascita:Date,        
    password:String,
    email:String,       
    corso_studi:String,       
    anno_accademico:Number,   
    ban:Boolean,
    amministratore:Boolean        
}, {collection: 'studente'}));