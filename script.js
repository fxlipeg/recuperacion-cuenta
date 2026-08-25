const ACCESS_PASSWORD = "Felipe1";
const STORAGE_KEY = "solicitudes-recuperacion";
const SESSION_KEY = "sesion-recuperacion";
const DEMO_USERNAME = "Fxlipe";
const DEMO_PASSWORD = "Felipe1";

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const activeUser = document.getElementById("activeUser");
const form = document.getElementById("recoveryForm");
const message = document.getElementById("message");
const recordsList = document.getElementById("recordsList");
const emptyMessage = document.getElementById("emptyMessage");
const clearButton = document.getElementById("clearButton");
const logoutButton = document.getElementById("logoutButton");

function getRecords() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function renderRecords() {
    const records = getRecords();
    recordsList.innerHTML = "";
    emptyMessage.hidden = records.length > 0;
    clearButton.disabled = records.length === 0;

    records.forEach(function (record) {
        const item = document.createElement("li");
        const date = new Date(record.createdAt).toLocaleString("es", {
            dateStyle: "medium",
            timeStyle: "short"
        });
        item.innerHTML = `<strong></strong><span class="repeated-user"></span><span class="record-date"></span>`;
        item.querySelector("strong").textContent = `Usuario: ${record.username}`;
        item.querySelector(".repeated-user").textContent = `Usuario repetido: ${record.usernameConfirmation || "No indicado"}`;
        item.querySelector(".record-date").textContent = date;
        recordsList.appendChild(item);
    });
}

function showApp() {
    loginView.classList.add("is-hidden");
    appView.classList.remove("is-hidden");
    activeUser.textContent = `Usuario: ${sessionStorage.getItem(SESSION_KEY) || DEMO_USERNAME}`;
    renderRecords();
}

if (sessionStorage.getItem(SESSION_KEY)) {
    showApp();
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const loginUsername = document.getElementById("loginUsername").value.trim();
    const loginPassword = document.getElementById("password").value;

    if (loginUsername.toLowerCase() !== DEMO_USERNAME.toLowerCase()) {
        loginMessage.textContent = "El usuario no es correcto. Usa Fxlipe.";
        return;
    }

    if (loginPassword !== DEMO_PASSWORD && loginPassword !== ACCESS_PASSWORD) {
        loginMessage.textContent = "La contraseña no es correcta.";
        return;
    }

    sessionStorage.setItem(SESSION_KEY, loginUsername);
    loginForm.reset();
    loginMessage.textContent = "";
    showApp();
});

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();
    const usernameConfirmation =
        document.getElementById("usernameConfirmation").value.trim();

    if (!username) {
        message.textContent = "Ingresa tu usuario para continuar.";
        return;
    }

    const records = getRecords();
    records.unshift({
        username,
        usernameConfirmation,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    message.textContent = "Tu solicitud está en proceso.";

    form.reset();
    renderRecords();

});

clearButton.addEventListener("click", function () {
    if (confirm("¿Borrar todas las solicitudes guardadas?")) {
        localStorage.removeItem(STORAGE_KEY);
        renderRecords();
        message.textContent = "Se borraron las solicitudes guardadas.";
    }
});

logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem(SESSION_KEY);
    appView.classList.add("is-hidden");
    loginView.classList.remove("is-hidden");
    loginMessage.textContent = "";
    activeUser.textContent = "";
});