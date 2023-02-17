const express = require('express');
const router = express.Router();
const AulaStudio = require('./models/aulaStudio');

router.get('', async (req, res) => {
    let auleStudios = await AulaStudio.find({});
    auleStudios = auleStudios.map( (auleStudios) => {
        return {
            self: 'auleStudios/' + auleStudios.id,
            nome: auleStudios.nome,
            id: auleStudios.id,
            posti_disponibili: auleStudios.posti_disponibili
        };
    });
    res.status(200).json(auleStudios);
});

router.get('/:id', async (req, res) => {
    let auleStudio = await AulaStudio.findById(req.params.id);
    res.status(200).send(
        "<!DOCTYPE html><html><head><h1>"+auleStudio.nome+" : "+auleStudio.locazione+"</h1> <h2>"+auleStudio.posti_disponibili+"</h2></head> <body><h2>"+auleStudio.QR_code+"</h2> </body> <form><input type = 'button' value ='Return back' onclick='history.back()'></form></html>"
    );

});


router.post('', async (req, res) => {
	let auleStudio = new AulaStudio({
        nome : req.body.nome,
        locazione : req.body.locazione,
        posti_disponibili : req.body.posti_disponibili,
        QR_code: req.body.QR_code,
    });
    
	auleStudio = await auleStudio.save();
    let auleStudioId = auleStudio.id;
    res.location("auleStudios/" + auleStudioId).status(201).send();
});

router.delete('/:id', async (req, res) => {
    let aulaStudio = await AulaStudio.findById(req.params.id).exec();
    if (!aulaStudio) {
        res.status(404).send()
        return;
    }
    await aulaStudio.deleteOne()
    res.status(204).send()
});

router.put('/:id', async (req,res)=> {
    let aulaStudio = await AulaStudio.findById(req.params.id).exec();
    if (!aulaStudio) {
        res.status(404).send()
        return;
    }else{
        let modifica=await AulaStudio.findByIdAndUpdate(req.params.id,{$set:{posti_disponibili:req.body.newPosti}},{new:true,runValidators:true})
        res.status(201).send()
    }
}) 

module.exports = router;

