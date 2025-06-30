import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

// Pour __dirname en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const API_URL = 'http://localhost:8000/api';

// Liste des établissements
app.get('/', async (req, res) => {
  try {
    const response = await fetch(`${API_URL}/etablissements/all/`);
    const etablissements = await response.json();
    res.render('index', { etablissements });
  } catch (err) {
    res.status(500).send('Erreur lors du chargement des établissements');
  }
});

// Formulaire de création établissement
app.get('/etablissement/create', (req, res) => {
  res.render('create-etablissement');
});

// Création établissement
app.post('/etablissement/create', async (req, res) => {
  try {
    const response = await fetch(`${API_URL}/etablissements/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const result = await response.json();
    if (response.ok) {
      res.redirect('/');
    } else {
      res.status(400).send(result.error || 'Erreur création');
    }
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

// Lister étudiants d'un établissement
// Ajoute cette route JSON pour répondre au fetch JS
app.get('/etablissement/:slug/etudiants', async (req, res) => {
  try {
    const { slug } = req.params;
    const response = await fetch(`${API_URL}/etablissements/${slug}/etudiants/`);
    const etudiants = await response.json();
    res.json(etudiants); // retourne en JSON
  } catch (err) {
    res.status(500).json({ error: 'Erreur chargement étudiants' });
  }
});


// Formulaire ajout étudiant
app.get('/etablissement/:slug/etudiants/add', (req, res) => {
  res.render('add-etudiant', { slug: req.params.slug });
});

// Création étudiant
app.post('/etablissement/:slug/etudiants/add', async (req, res) => {
  try {
    const { slug } = req.params;
    const response = await fetch(`${API_URL}/etablissements/${slug}/etudiants/add/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const result = await response.json();
    if (response.ok) {
      res.redirect(`/etablissement/${slug}/etudiants`);
    } else {
      res.status(400).send(result.error || 'Erreur ajout étudiant');
    }
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur Express lancé sur http://localhost:${PORT}`));
