import { reactive } from 'vue'

const loggedUser = reactive({
    token: undefined,
    email: undefined,
    id: undefined,
    self: undefined,
    amministratore : undefined,
    /*successo : false,
    message : undefined, 
    cookie : false*/
})

function setLoggedUser (data) {
    loggedUser.token = data.token;
    loggedUser.email = data.email;
    loggedUser.id = data.id;
    loggedUser.self = data.self;
    loggedUser.amministratore = data.amministratore;
    /*loggedUser.successo = data.successo;
    loggedUser.message = data.message;
    loggedUser.cookie = true;*/
    //$cookies.set("email",data.email,86400);
}

function clearLoggedUser () {
    loggedUser.token = undefined;
    loggedUser.email = undefined;
    loggedUser.id = undefined;
    loggedUser.self = undefined;
    loggedUser.amministratore = undefined;
    /*loggedUser.successo = false;
    loggedUser.message = undefined;
    loggedUser.cookie = false;*/
    //$cookies.remove("email");
}

export { loggedUser, setLoggedUser, clearLoggedUser } 