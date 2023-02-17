<script setup>
import { ref, onMounted, watch } from 'vue'
import { loggedUser } from '../states/loggedUser.js'
import { auleStudios, fetchAuleStudio, createAuleStudio, deleteAuleStudio } from '../states/auleStudio.js'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const AULA_URL = HOST+'/auleStudios'
const PRENOTAZIONE_URL = HOST+'/prenotazione'

const prenotazioni = ref([])

onMounted( () => {
    fetchAuleStudio()
    fetchData()
})

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
    fetchAuleStudio()
    fetchData()
})

async function fetchData() {
  if (!loggedUser.token) {
    prenotazioni.value = []
    return;
  }
  const url =HOST+'/prenotazione/' + loggedUser.id
  //console.log(url);
  prenotazioni.value = await (await fetch(url)).json()
}


async function deletePrenotazione(prenotazione) {
  fetch(HOST+"/"+prenotazione.self, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'x-access-token': loggedUser.token }
  })
  .then(() => {
    fetchData();
  })
  .catch( error => console.error(error));
};


</script>

<template>
  <span v-if="loggedUser.token"> Queste sono le tue prenotazioni , {{loggedUser.nome}}: </span>
  <span v-if="!loggedUser.token" style="color: red"> 'Esegui il login per visualizzare le tue aule studio! </span>
  <ul>
    <li v-for="prenotazione in prenotazioni" :key="prenotazione.self">
      <a :href="HOST+'/'+auleStudios.value.find(b=>b.self==prenotazione.aulaStudio).self">{{ ( auleStudios.value.find(b=>b.self==prenotazione.aulaStudio) || {nome: 'unknown'} ).nome}}</a>
      <a>{{ prenotazione.data.substring(0,10) }}</a>
      -
      <button @click="deletePrenotazione(prenotazione)">DELETE</button>
    </li>
  </ul>
</template>