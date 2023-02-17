import { reactive, ref } from 'vue'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const PRENOTAZIONI_URL = HOST+ '/prenotazioni'



const prenotazioni = reactive([])

async function fetchPrenotazioni() {
    prenotazioni.value = await (await fetch(PRENOTAZIONI_URL)).json()
}


export { prenotazioni, fetchPrenotazioni} 