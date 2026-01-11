// api/index.js
import { handler } from '../dist/ssr/index.js';

export default function (req, res) {
  return handler(req, res);
}