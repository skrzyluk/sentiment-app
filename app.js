const express = require('express');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const logMessages = [];

app.get('/', (req, res) => {
  const messages = [...logMessages, 'Serwer działa!', `Port: ${PORT}`];
  res.send(`
    <html>
      <head><title>Logi serwera</title></head>
      <body>
        <h1>Logi:</h1>
        <ul>${messages.map(m => `<li>${m}</li>`).join('')}</ul>
      </body>
    </html>
  `);
});

app.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Tekst nie może być pusty' });
    }

    const hfResponse = await fetch(
      'https://router.huggingface.co/hf-inference/models/siebert/sentiment-roberta-large-english',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: text })
      }
    );

    const textResult = await hfResponse.text();
    console.log('Odpowiedź z API:', textResult);

    let resultAI;
    try {
      resultAI = JSON.parse(textResult);
    } catch (err) {
      console.error('Nieprawidłowy JSON z API');
      return res.status(500).json({ error: 'Model AI zwrócił niepoprawną odpowiedź' });
    }

    let label = 'UNKNOWN';

    // Obsługa formatu [[{label, score}]] lub [{label, score}]
    const entries = Array.isArray(resultAI[0]) ? resultAI[0] : resultAI;
    if (Array.isArray(entries) && entries.length > 0) {
      const best = entries.sort((a, b) => b.score - a.score)[0];
      console.log('Najlepszy wynik:', best);
      if (best.label === 'POSITIVE' || best.label === 'NEGATIVE') {
        label = best.label;
      }
    }

    res.json({ sentiment: label });
  } catch (err) {
    console.error('Błąd analizy:', err.message);
    res.status(500).json({ error: 'Błąd podczas analizy: ' + err.message });
  }
});

const { exec } = require('child_process');
app.listen(PORT, () => {
  const msg = `Serwer działa: http://localhost:${PORT}`;
  console.log(msg);
  logMessages.push(msg);
  exec(`start http://localhost:${PORT}`);
});
