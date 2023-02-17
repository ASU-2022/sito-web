import { reactive } from 'vue'
import { loggedUser } from './loggedUser.js'


console.log(loggedUser.id)
const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const PROFILE_URL = HOST+'/studentis/'
console.log(PROFILE_URL)



const profiles = reactive([])

async function fetchStudente() {
    profiles.value = await (await fetch(PROFILE_URL)).json()
}

export { profiles, fetchStudente } 