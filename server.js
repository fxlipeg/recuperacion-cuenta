const path = require("path");
const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const adminKey = process.env.ADMIN_KEY && process.env.ADMIN_KEY.trim();
const configuredMongoUri = (process.env.MONGODB_URI || process.env.MONGO_URI || "").trim();
const mongoUri = configuredMongoUri.replace(/^(["'])(.*)\1$/, "$2");
const mongoUriIsValid = /^mongodb(?:\+srv)?:\/\//.test(mongoUri);
const mongoDbName = process.env.MONGODB_DB && process.env.MONGODB_DB.trim() || "recuperacion_cuenta";
const client = mongoUriIsValid ? new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    retryWrites: true
}) : null;
let connectionPromise;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname));

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

function requireAdmin(request, response, next) {
    if (!adminKey || request.get("x-admin-key") !== adminKey) {
        return response.status(401).json({ error: "No autorizado." });
    }

    next();
}

async function getCollection() {
    if (!client) {
        throw new Error(configuredMongoUri
            ? "MONGODB_URI no tiene un formato válido. Usa mongodb:// o mongodb+srv://."
            : "MONGODB_URI no está configurada.");
    }

    try {
        if (!connectionPromise) {
            connectionPromise = client.connect();
        }

        await connectionPromise;
        return client.db(mongoDbName).collection("solicitudes");
    } catch (error) {
        connectionPromise = null;
        throw error;
    }
}

app.get("/api/status", async (request, response) => {
    try {
        await getCollection();
        response.json({ connected: true });
    } catch (error) {
        console.error("MongoDB status error:", error.message);
        response.status(503).json({ connected: false, error: error.message });
    }
});

app.post("/api/records", async (request, response) => {
    const { username, usernameConfirmation } = request.body;

    if (typeof username !== "string" || typeof usernameConfirmation !== "string" || !username.trim()) {
        return response.status(400).json({ error: "El usuario es obligatorio." });
    }

    try {
        const collection = await getCollection();
        await collection.insertOne({
            username: username.trim().slice(0, 120),
            usernameConfirmation: usernameConfirmation.trim().slice(0, 120),
            createdAt: new Date()
        });
        response.status(201).json({ ok: true });
    } catch (error) {
        console.error(error.message);
        response.status(503).json({ error: "No se pudo guardar la solicitud." });
    }
});

app.get("/api/records", requireAdmin, async (request, response) => {
    try {
        const collection = await getCollection();
        const records = await collection.find({}, {
            projection: { _id: 0, username: 1, usernameConfirmation: 1, createdAt: 1 }
        }).sort({ createdAt: -1 }).toArray();
        response.json(records);
    } catch (error) {
        console.error(error.message);
        response.status(503).json({ error: "No se pudieron cargar los registros." });
    }
});

app.delete("/api/records", requireAdmin, async (request, response) => {
    try {
        const collection = await getCollection();
        await collection.deleteMany({});
        response.json({ ok: true });
    } catch (error) {
        console.error(error.message);
        response.status(503).json({ error: "No se pudieron borrar los registros." });
    }
});

app.listen(port, () => {
    console.log(`Servidor disponible en http://localhost:${port}`);
});
