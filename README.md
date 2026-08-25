# recuperacion-cuenta

Página de recuperación de cuenta con registro de solicitudes en MongoDB.

## Uso

- Para abrir el panel admin de demostración, escribe `Fxlipe1` en ambos campos del formulario.
- Las solicitudes se guardan en MongoDB y se pueden consultar desde cualquier dispositivo que use el mismo servidor.
- Copia `.env.example` como `.env` y configura `MONGODB_URI`, `MONGODB_DB` y `ADMIN_KEY`.
- Instala dependencias con `npm install` y ejecuta con `npm start`.
- El panel admin es una demostración para el curso; para proteger datos reales se necesita autenticación de servidor más completa.
