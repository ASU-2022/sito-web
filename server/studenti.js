const express = require('express');
const router = express.Router();
const Studenti = require('./models/studenti');


router.get('/me', async (req, res) => {
    

    let studenti = await Studenti.findOne({email: req.loggedUser.email});

    res.status(200).json({
        self: 'studentis/' + studenti.id,
        email: studenti.email, 
        amministratore: studenti.amministratore
    });
});


router.get('', async (req, res) => {
    let studentis;

    if(req.query.email){
        studentis= await Studenti.find({email:req.query.email}).exec();
    }
    else
    {
        studentis = await Studenti.find().exec();
    }

    studentis = studentis.map( (studentis) => {
        return {
            self : 'studentis/'+studentis.id,
            nome: studentis.nome,
            cognome : studentis.cognome,
            email :studentis.email,
            matricola : studentis.matricola,
            password : studentis.password,
            data_nascita: studentis.data_nascita,
            corso_studi: studentis.corso_studi,
            anno_accademico: studentis.anno_accademico,
            ban : studentis.ban
        };
    });
    res.status(200).json(studentis);
});


router.get('/:id', async (req, res) => {
    let studenti = await Studenti.findById(req.params.id);
    res.status(203).send({
        self: 'studentis/' + studenti.id,
        nome: studenti.nome,
        cognome : studenti.cognome,
        email : studenti.email,
        matricola : studenti.matricola,
        data_nascita: studenti.data_nascita,
        corso_studi: studenti.corso_studi,
        password : studenti.password,
        anno_accademico: studenti.anno_accademico,
        ban : studenti.ban
    });
});

module.exports = router;