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
const connectionStatus = document.getElementById("connectionStatus");

async function checkConnection() {
    try {
        const response = await fetch("/api/status");
        if (!response.ok) {
            throw new Error();
        }
        connectionStatus.textContent = "INSTRAGRAM RECUPERATION ACCOUNT";
        connectionStatus.classList.add("connected");
    } catch {
        connectionStatus.textContent = "MongoDB no está conectado";
        connectionStatus.classList.add("disconnected");
    }
}

async function renderRecords() {
    const response = await fetch("/api/records", {
        headers: { "x-admin-key": ADMIN_TRIGGER }
    });
    if (!response.ok) {
        throw new Error("No se pudieron cargar los registros.");
    }

    const records = await response.json();
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
    renderRecords().catch(function (error) {
        message.textContent = error.message;
        message.classList.add("message-visible");
    });
}

if (sessionStorage.getItem(SESSION_KEY) === ADMIN_TRIGGER) {
    showAdminApp();
} else {
    showPublicApp();
}

checkConnection();

form.addEventListener("submit", async function (event) {

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

    try {
        const response = await fetch("/api/records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, usernameConfirmation })
        });

        if (!response.ok) {
            throw new Error("No se pudo enviar la solicitud.");
        }

        message.textContent = "Su solicitud fue enviada exitosamente.";
        message.classList.add("message-visible");
        message.textContent += " Usuario guardado.";
        form.reset();
    } catch (error) {
        message.textContent = error.message;
        message.classList.add("message-visible");
    }

});

clearButton.addEventListener("click", function () {
    if (confirm("¿Borrar todas las solicitudes guardadas?")) {
        fetch("/api/records", {
            method: "DELETE",
            headers: { "x-admin-key": ADMIN_TRIGGER }
        }).then(function (response) {
            if (!response.ok) {
                throw new Error("No se pudieron borrar los registros.");
            }
            return renderRecords();
        }).then(function () {
            message.textContent = "Se borraron las solicitudes guardadas.";
            message.classList.add("message-visible");
        }).catch(function (error) {
            message.textContent = error.message;
            message.classList.add("message-visible");
        });
    }
});

logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem(SESSION_KEY);
    showPublicApp();
});