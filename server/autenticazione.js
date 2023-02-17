const express = require('express');
const router = express.Router();
const Studenti = require('./models/studenti');
const jwt = require('jsonwebtoken');

router.post('', async function(req, res) {
	
	// find the user
	let studente = await Studenti.findOne({
		email: req.body.email
	}).exec();
	
	// user not found
	if (!studente) {
		res.json({ success: false, message: 'studente non trovato' });
	}
	else if (studente.password != req.body.password) {
		res.json({ success: false, message: 'Password Sbagliata'});
	}
	else{
		var payload = {
			email: studente.email,
			id: studente.id	
		}
		var options = {
			expiresIn: 86400 // expires in 24 hours
		}
		var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

		res.json({
			success : true,
			message: 'Token!',
			token: token,
			email: studente.email,
			id: studente.id,
			amministratore: studente.amministratore,
			self: "/"+ studente.id
		});
	}
});

module.exports = router;