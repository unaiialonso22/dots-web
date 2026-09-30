// Paths served by this app. Everything else ("/", "/premium", "/comunidad", "/privacidad"…) is the static landing.
// Keep in sync with the rewrites in vercel.json and APP_ROUTE in vite.config.ts.
export const APP_PATH = /^\/(auth|challenge|training|improve|feed|portfolio|messages|pago|user|blog)(\/|$)/;
