<script setup>
import { ref, onMounted, watch, reactive} from 'vue'
import { loggedUser } from '../states/loggedUser.js'
import { auleStudios, fetchAuleStudio, createAuleStudio, deleteAuleStudio } from '../states/auleStudio.js'
//import { prenotazioni2, fetchPrenotazioni2} from '../states/prenotazione.js'
//import Map from '@/components/Map.vue'


const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
//const POIS_URL = HOST+'/pois'
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
    console.log("sono qui "+loggedUser.id)
    const LINK2=PRENOTAZIONI_URL+"/"+aulaStudio.id+"/"+data[index]+"/"+loggedUser.id
    prenotazioni3.value =  await(await fetch(LINK2)).json();
    risposta=prenotazioni3.value.valore;
}



function createAulaStudioButton() {
  if (nome.value=='') {
    warningMessage.value = 'Please specify a valid name!'
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
  delReviewMessage.value='Delete Aula studio effettuata';
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
        //reviewMessage.value = 'Posti modificatati';
        location.reload();
        return;
      }).catch( error => console.error(error) ); // If there is any error you will catch them here
};

/*async function prenotaAulaStudio(aulaStudio) {
  if (!loggedUser.token) {
    warningMessage.value = 'Perfavore effettua il login per prenotarti'
    return;
  }
  warningMessage.value = ''
  if(!data.value){
    warningMessage.value = 'Perfavore specifica una data corretta per la prenotazione (una settimana)'
    return;
  }
  console.log(PRENOTAZIONI_URL+"/"+aulaStudio.id+"/"+data.value);

  await fetchPrenotazioni2(aulaStudio);
  console.log(prova);*/

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
  //console.log(PRENOTAZIONI_URL+"/"+aulaStudio.id+"/"+data.value);

  fetchPrenotazioni2(aulaStudio, index).then(()=>{
    if(prova>=aulaStudio.posti_disponibili){
      warningMessage.value = 'Mi dispiace ma nella giornata '+data[index]+' non ci sono piu posti disponibili!'
      return;
    }
    fetchPrenotazioni3(aulaStudio, index).then(()=>{
      //console.log(PRENOTAZIONI_URL+"/"+aulaStudio.id+"/"+data.value+"/"+loggedUser.id);
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
      }).catch( error => console.error(error) ); // If there is any error you will catch them here
    })
  })

  /*fetch(PRENOTAZIONI_URL+"/"+aulaStudio.id+"/"+data.value,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        }
    })
    .then((resp) =>{
      console.log(resp.posti)
      console.log(resp.body)
      console.log(resp.value)
      console.log(aulaStudio.posti_disponibili)
      if(Object.keys(resp).length>=aulaStudio.posti_disponibili){
        warningMessage.value="attenzione l'aula studio è piena"
        return;
      }    
    })
    .catch( error => console.error(error) );

    return;*/
};

/*const date = new Date();

let day = date.getDate();
let month = date.getMonth()+1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${year}-${month}-${day}`;
console.log(currentDate.toString()); // "17-6-2022"
let currentDate2 = `${year}-${month}-${day+7}`;
console.log(currentDate2.toString());

function minData(){
  return currentDate.toString();
}
function maxData(){
  return currentDate2.toString();
}

let data1=currentDate.toString();
let data2=currentDate2.toString();
*/
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
      <p>{{ aulaStudio.posti_disponibili }}</p>
      <br>
      <input onkeydown="return false" type="date" v-model="data[index]" min="2023-02-13" max="2023-02-20"/>
      <button @click="prenotaAulaStudio(aulaStudio, index)">Prenotati</button>
      -
      <input v-if="loggedUser.token && loggedUser.amministratore==true" v-model="newPosti" placeholder="cambia posti"/> <button v-if="loggedUser.token && loggedUser.amministratore==true" @click="modificaPosti(aulaStudio.id)">Modifica</button><br>
      <button v-if="loggedUser.token && loggedUser.amministratore==true" @click="deleteAulaStudioButton(aulaStudio, index)">DELETE</button><br>
      <span style="color: red"> {{reviewMessage}} </span>
      <span style="color: red"> {{warningMessage}} </span>
    </li>
  </ul>
</template>


