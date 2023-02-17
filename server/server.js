const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const swaggerUi= require ('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const tokenChecker = require('./tokenChecker.js');

const studenti= require('./studenti.js');
const auleStudio= require('./auleStudio.js');
const prenotazione= require('./prenotazione.js');

const autenticazione = require('./autenticazione.js');
const mongoose = require('mongoose');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

mongoose.connect(
    process.env.MONGODB_URL,
    {useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);


app.use('/autenticazione', autenticazione);
app.use('/studentis/me', tokenChecker);

//resourse routing
app.use('/auleStudios', auleStudio);
app.use('/studentis', studenti);
app.use('/prenotazione', prenotazione);

const listener = app.listen(process.env.PORT || 8080, () => {
    console.log('Your app is listening on port' + listener.address().port)
})

module.exports = app;
