const ACCESS_PASSWORD = "cambia-esta-clave";
const STORAGE_KEY = "solicitudes-recuperacion";
const SESSION_KEY = "sesion-recuperacion";

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
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
        item.innerHTML = `<strong></strong><span></span>`;
        item.querySelector("strong").textContent = record.username;
        item.querySelector("span").textContent = date;
        recordsList.appendChild(item);
    });
}

function showApp() {
    loginView.classList.add("is-hidden");
    appView.classList.remove("is-hidden");
    renderRecords();
}

if (sessionStorage.getItem(SESSION_KEY) === "true") {
    showApp();
}

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (document.getElementById("password").value !== ACCESS_PASSWORD) {
        loginMessage.textContent = "La contraseña no es correcta.";
        return;
    }

    sessionStorage.setItem(SESSION_KEY, "true");
    loginForm.reset();
    loginMessage.textContent = "";
    showApp();
});

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    if (!username) {
        message.textContent = "Ingresa tu usuario.";
        return;
    }

    const records = getRecords();
    records.unshift({ username, createdAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    message.textContent = "Solicitud recibida y guardada en este dispositivo.";

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
});