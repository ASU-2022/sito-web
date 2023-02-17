var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('aulaStudio', new Schema({ 
	nome: String,
    locazione: String,       
    posti_disponibili: Number,  
    QR_code: String,
}, {collection: 'aula_studio'}));