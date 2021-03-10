/**
 * PUERTO
 */
export const PORT = process.env.PORT || 5000;

/**
 * Database connection
 */
export const MONGO_CONNECTION =
  process.env.MONGO_CONNECTION ||
  'mongodb+srv://tyto:O1OdIZvXX5dHuMNJ@cluster0-fkyqi.mongodb.net/tyto';

/**
 * Firebase private key
 */

export const Alp = 'src/utils/parent-cats.json';

process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  'src/config/firebase-key-dev.json';
export const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS;
/**
 * Default API Message
 */

export const DEFAULT_API_WELCOME_MESSAGE =
  process.env.DEFAULT_API_WELCOME_MESSAGE || 'Hola!';

export const MAPBOX_API_KEY =
  process.env.MAPBOX_API_KEY ||
  'pk.eyJ1IjoianVsaWFubWlyYW5kYXdheXUyIiwiYSI6ImNrYWgyMG1jNTAyb2wyd3FlMTl5dXN0cnoifQ.amDhY-A087EYgGpYiycrSA';
