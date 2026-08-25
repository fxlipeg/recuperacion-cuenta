# recuperacion-cuenta

Página de recuperación de cuenta con acceso protegido y registro local de solicitudes.

## Uso

- Acceso de demostración: usuario `Fxlipe`, contraseña `Fxlipe123`.
- También se conserva `ACCESS_PASSWORD` como clave local alternativa; puedes cambiarla al comienzo de `script.js`.
- Las solicitudes se guardan en `localStorage` y solo se pueden consultar desde el mismo navegador y dispositivo.
- La contraseña del archivo es una protección básica para una página estática; para proteger datos sensibles se necesita un servidor con autenticación real.
