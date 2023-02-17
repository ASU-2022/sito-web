<script setup>
import { ref, onMounted, watch, reactive} from 'vue'
import { loggedUser } from '../states/loggedUser.js'
import { auleStudios, fetchAuleStudio, createAuleStudio, deleteAuleStudio } from '../states/auleStudio.js'


const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const PRENOTAZIONI_URL = HOST+'/prenotazione'
const AULESTUDIO_URL = HOST+'/auleStudios'



const nome = ref('')
const locazione = ref('')
const posti_disponibili = ref('')
const QR_code = ref('')
const data = reactive([])
const newPosti=ref('')


const warningMessage = ref('')
const reviewMessage = ref('')
const delReviewMessage = ref('')
let prova
let risposta
const prenotazioni2=ref([])
const prenotazioni3=ref([])


onMounted( () => {
  fetchAuleStudio() // fetch on init
})

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
  warningMessage.value = ''
})

async function fetchPrenotazioni2(aulaStudio, index) {
    const LINK=PRENOTAZIONI_URL+"/"+aulaStudio.id+"/"+data[index]
    prenotazioni2.value =  await(await fetch(LINK)).json();
    prova=prenotazioni2.value.posti;    
}

async function fetchPrenotazioni3(aulaStudio, index) {
    const LINK2=PRENOTAZIONI_URL+"/"+aulaStudio.id+"/"+data[index]+"/"+loggedUser.id
    prenotazioni3.value =  await(await fetch(LINK2)).json();
    risposta=prenotazioni3.value.valore;
}



function createAulaStudioButton() {
  if (nome.value=='' || locazione.value=='' || posti_disponibili.value=='' || QR_code.value=='') {
    warningMessage.value = 'Perfavore inserisci i dati correttamente'
    return;
  }
  warningMessage.value = ''
  createAuleStudio(
    nome.value,
    locazione.value,
    posti_disponibili.value,
    QR_code.value).catch( err => console.error(err) );
};

function deleteAulaStudioButton(aulaStudio) {
  deleteAuleStudio(aulaStudio).catch( err => console.error(err) );
  delReviewMessage.value='Delete Aula studio approvata';
};

function modificaPosti(id) {
  fetch(AULESTUDIO_URL+'/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
        body: JSON.stringify( { newPosti: newPosti.value } ),
      }).then((resp) => {
        reviewMessage.value = 'Posti modificatati';
        location.reload();
        return;
      }).catch( error => console.error(error) );
};

  function prenotaAulaStudio(aulaStudio, index) {
  if (!loggedUser.token) {
    warningMessage.value = 'Perfavore effettua il login per prenotarti'
    return;
  }
  warningMessage.value = ''
  if(!data[index]){
    warningMessage.value = 'Perfavore specifica una data corretta per la prenotazione (una settimana)'
    return;
  }

  fetchPrenotazioni2(aulaStudio, index).then(()=>{
    if(prova>=aulaStudio.posti_disponibili){
      warningMessage.value = 'Mi dispiace ma nella giornata '+data[index]+' non ci sono piu posti disponibili!'
      return;
    }
    fetchPrenotazioni3(aulaStudio, index).then(()=>{
      if(risposta==true){
        warningMessage.value = 'Sei già prenotato per la giornata '+data[index]+'!'
        return;
      }
      fetch(PRENOTAZIONI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
        body: JSON.stringify( { data: data[index], studenteId: loggedUser.self, aulaStudioId: aulaStudio.self } ),
      }).then((resp) => {
        reviewMessage.value = 'Prenotazione Creata';
        return;
      }).catch( error => console.error(error) ); 
    })
  })

};

</script>



<template>
  
  <form v-if="loggedUser.token && loggedUser.amministratore==true">
    <span>Insert a new aula studio</span>
    <br />
    <input v-model="nome" placeholder="nome"/>
    <input v-model="locazione" placeholder="locazione" />
    <input v-model="posti_disponibili" placeholder="posti_disponibili" />
    <input v-model="QR_code" placeholder="QR_code"/>
    <button type="button" @click="createAulaStudioButton">Inserisci una nuova Aula Studio </button>
    <br />
    <span style="color: red"> {{warningMessage}} </span>
  </form>
  <h1>Aule studio:</h1>
  <ul>
    <li v-for='(aulaStudio, index) in auleStudios.value' :key="index">
      <a :href="HOST+'/'+aulaStudio.self">{{aulaStudio.nome}}</a>
      <p>Posti totali disponibili : {{ aulaStudio.posti_disponibili }}</p>
      <br>
      <input onkeydown="return false" type="date" v-model="data[index]" min="2023-02-17" max="2023-02-24"/>
      <button @click="prenotaAulaStudio(aulaStudio, index)">Prenotati</button>
      -
      <input v-if="loggedUser.token && loggedUser.amministratore==true" v-model="newPosti" placeholder="cambia posti"/> <button v-if="loggedUser.token && loggedUser.amministratore==true" @click="modificaPosti(aulaStudio.id)">Modifica</button><br>
      <button v-if="loggedUser.token && loggedUser.amministratore==true" @click="deleteAulaStudioButton(aulaStudio, index)">DELETE</button><br>
    </li>
    <span style="color: red"> {{reviewMessage}} </span>
    <br>
    <span style="color: red"> {{warningMessage}} </span>
  </ul>
</template>


