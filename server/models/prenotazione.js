var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('prenotazione', new Schema({ 
	studenteId:String,     
    aulaStudioId: String,
    data: String,
}, {collection: 'prenotazione'}));