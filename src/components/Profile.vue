<script setup>
import { reactive } from 'vue'
import { ref, onMounted, watch } from 'vue'
import { loggedUser } from '../states/loggedUser.js'
//import Map from '@/components/Map.vue'


const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
//const REVIEW_URL = HOST +'/reviews'



const profiles = ref([])

const warningMessage = ref('')


onMounted( () => {
  fetchStudente() // fetch on init
})

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
  warningMessage.value = ''
})

async function fetchStudente() {
    const PROFILE_URL = HOST+'/studentis/'+loggedUser.id;
    profiles.value = await (await fetch(PROFILE_URL)).json()
}




</script>


<template>
    <h1>Le tue informazioni:</h1>
    <h3>{{ profiles.nome }}</h3>
    <h3>{{ profiles.cognome }}</h3>
    <h3>{{ profiles.matricola }}</h3>
    <h3>{{ profiles.data_nascita }}</h3>
    <h3>{{ profiles.email }}</h3>
    <h3>{{ profiles.corso_studi }}</h3>
    <h3>{{ profiles.anno_accademico }}</h3>
</template>
