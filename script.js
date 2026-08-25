const form = document.getElementById("recoveryForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    if (!username) {
        message.textContent = "Ingresa tu usuario.";
        return;
    }

    message.textContent =
        "Solicitud recibida. Si la cuenta existe, recibirás instrucciones de recuperación.";

    form.reset();

});