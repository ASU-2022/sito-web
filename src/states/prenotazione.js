import { reactive, ref } from 'vue'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const PRENOTAZIONI_URL = HOST+ '/prenotazioni'



const prenotazioni = reactive([])
const prenotazioni2 = reactive([])

async function fetchPrenotazioni() {
    prenotazioni.value = await (await fetch(PRENOTAZIONI_URL)).json()
}

async function fetchPrenotazioni2(LINK) {
    prenotazioni2.value =  await(await fetch(LINK)).json()
}

export { prenotazioni, prenotazioni2, fetchPrenotazioni, fetchPrenotazioni2} 