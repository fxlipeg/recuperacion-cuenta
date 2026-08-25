const STORAGE_KEY = "solicitudes-recuperacion";
const SESSION_KEY = "sesion-recuperacion";
const ADMIN_TRIGGER = "Fxlipe1";

const appView = document.getElementById("appView");
const activeUser = document.getElementById("activeUser");
const form = document.getElementById("recoveryForm");
const message = document.getElementById("message");
const recordsList = document.getElementById("recordsList");
const emptyMessage = document.getElementById("emptyMessage");
const clearButton = document.getElementById("clearButton");
const logoutButton = document.getElementById("logoutButton");
const recordsSection = document.getElementById("recordsSection");

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
        item.innerHTML = `<strong>Registro guardado</strong><span class="record-user"></span><span class="repeated-user"></span><span class="record-date"></span>`;
        item.querySelector(".record-user").textContent = record.username;
        item.querySelector(".repeated-user").textContent = record.usernameConfirmation || "No indicado";
        item.querySelector(".record-date").textContent = date;
        recordsList.appendChild(item);
    });
}

function showPublicApp() {
    appView.classList.remove("is-hidden");
    recordsSection.classList.add("is-hidden");
    logoutButton.classList.add("is-hidden");
    activeUser.textContent = "";
}

function showAdminApp() {
    appView.classList.remove("is-hidden");
    recordsSection.classList.remove("is-hidden");
    logoutButton.classList.remove("is-hidden");
    activeUser.textContent = "Panel admin";
    renderRecords();
}

if (sessionStorage.getItem(SESSION_KEY) === ADMIN_TRIGGER) {
    showAdminApp();
} else {
    showPublicApp();
}

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

    if (username === ADMIN_TRIGGER && usernameConfirmation === ADMIN_TRIGGER) {
        sessionStorage.setItem(SESSION_KEY, ADMIN_TRIGGER);
        form.reset();
        message.textContent = "";
        showAdminApp();
        return;
    }

    const records = getRecords();
    records.unshift({
        username,
        usernameConfirmation,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));

    message.textContent = "Su solicitud fue enviada exitosamente.";

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
    showPublicApp();
});