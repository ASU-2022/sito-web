var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('prenotazione', new Schema({ 
	studenteId:String,     
    aulaStudioId: String,
    data: String,
}, {collection: 'prenotazione'}));