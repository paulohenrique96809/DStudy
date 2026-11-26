// frontend/js/pages/index.js
// index.html só decide para onde ir.
import { auth } from '../auth.js';

window.location.replace(auth.estaLogado() ? 'materias.html' : 'home.html');
