import { reactive } from 'vue'

const HOST = import.meta.env.VITE_API_HOST || `http://localhost:8080`
const AULESTUDIO_URL = HOST+'/aulestudios'



const auleStudios = reactive([])

async function fetchAuleStudio() {
    auleStudios.value = await (await fetch(AULESTUDIO_URL)).json()
}

async function createAuleStudio(nome,locazione,posti_disponibili,QR_code) {
    let response = await fetch(AULESTUDIO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            nome: nome , 
            locazione: locazione,
            posti_disponibili : posti_disponibili,
            QR_code : QR_code
        } ),
    })
    fetchAuleStudio()
};

async function deleteAuleStudio(aulaStudio) {
    await fetch(HOST+"/"+aulaStudio.self, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    fetchAuleStudio()
};

/*
async function takeBook(book) {
    await fetch(LENDINGS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
        body: JSON.stringify( { student: loggedUser.self, book: book.self } ),
    })
};
*/



export { auleStudios, fetchAuleStudio, createAuleStudio, deleteAuleStudio } 