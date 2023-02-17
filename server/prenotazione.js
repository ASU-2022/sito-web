const express = require('express');
const router = express.Router();
const Prenotazione = require('./models/prenotazione');
const Studente = require('./models/studenti');
const AulaStudio = require('./models/aulaStudio');

router.get('', async (req, res) => {
    let prenotazioni = await Prenotazione.find({});
    prenotazioni = prenotazioni.map( (dbEntry) => {
        return {
            self: 'prenotazione/' + dbEntry.id,
            studenteId: dbEntry.studenteId,
            aulaStudioId: dbEntry.aulaStudioId,
            data: dbEntry.data
        };
    });
    res.status(200).json(prenotazioni);
});

router.get('/:id', async (req, res) => {
    let prenotazioni = await Prenotazione.find({studenteId : req.params.id});
    prenotazioni = prenotazioni.map((dbEntry) => {
        return {
            self: 'prenotazione/' + dbEntry.id,
            data : dbEntry.data,
            studente: 'studentis/' + dbEntry.studenteId,
            aulaStudio: 'auleStudios/' + dbEntry.aulaStudioId
        };
    });
    res.status(200).json(prenotazioni);

    //aesfa
});


router.delete('/:id', async (req, res) => {
    let prenotazione = await Prenotazione.findById(req.params.id).exec();
    if (!prenotazione) {
        res.status(404).send()
        console.log('Prenotazione non trovata')
        return;
    }
    await prenotazione.deleteOne()
    console.log('Prenotazione rimossa')
    res.status(204).send()
});

router.get('/:id/:data', async (req, res) => {
    let prenotazioni = await Prenotazione.find({aulaStudioId : req.params.id, data : req.params.data});
    prenotazioni = prenotazioni.map((dbEntry) => {
        return {
            self: 'prenotazione/' + dbEntry.id,
            data : dbEntry.data,
            studente: 'studentis/' + dbEntry.studenteId,
            aulaStudio: 'auleStudios/' + dbEntry.aulaStudioId
        };
    });
    let posti2=Object.keys(prenotazioni).length
    res.send({posti:posti2}); 
});

router.get('/:idAulaStudio/:data/:idStudente', async (req, res) => {
    let prova3;
    let risultato=false;
    let prenotazioni = await Prenotazione.find({aulaStudioId : req.params.idAulaStudio, data : req.params.data, studenteId : req.params.idStudente});
    prenotazioni = prenotazioni.map((dbEntry) => {
        return {
            self: 'prenotazione/' + dbEntry.id,
            data : dbEntry.data,
            studente: 'studentis/' + dbEntry.studenteId,
            aulaStudio: 'auleStudios/' + dbEntry.aulaStudioId
        };
    });
    prova3=Object.keys(prenotazioni).length
    if(prova3 == 0){
        console.log(prenotazioni)
        risultato=false;
    }else{
        console.log(prenotazioni)
        risultato=true;
    }
    res.status(200).send({valore:risultato}); 
});


router.post('', async (req, res) => {
    let studenteUrl = req.body.studenteId;
    let aulaStudioUrl = req.body.aulaStudioId;

    if (!studenteUrl) {
        res.status(400).json({ error: 'Studente not specificato' });
        return;
    };

    if (!aulaStudioUrl) {
        res.status(400).json({ error: 'Aula studio non specificata' });
        return;
    };

    let studenteId = studenteUrl.substring(studenteUrl.lastIndexOf('/') + 1);
    let studente = null;
    try {
        studente = await Studente.findById(studenteId);
    } catch (error) {}

    if (studente == null) {
        res.status(400).json({ error: 'Studente non esistente' });
        return;
    };

    let aulaStudioId = aulaStudioUrl.substring(aulaStudioUrl.lastIndexOf('/') + 1);
    let aulaStudio = null;
    try {
        aulaStudio = await AulaStudio.findById(aulaStudioId).exec();
    } catch (error) {}

    if (aulaStudio == null) {
        res.status(400).json({ error: 'Aula studio non esistente' });
        return;
    };

    let prenotazione = new Prenotazione({
        data : req.body.data,
        studenteId: studenteId,
        aulaStudioId: aulaStudioId,
    });

    prenotazione = await prenotazione.save();

    let prenotazioneId = prenotazione.id;

    res.location("prenotazione/" + prenotazioneId).status(201).send();
});

module.exports=router;