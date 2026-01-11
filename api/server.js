// api/index.js
import { handler } from '../dist/ssr/index.js';

export default async function (req, res) {
  try {
    // Quasar handler is an (req, res) Express-like function
    return handler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}