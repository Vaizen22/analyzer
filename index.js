const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { candles } = req.body;

  const prompt = `
Analyse les données de marché suivantes (format: [timestamp, open, high, low, close, volume]):
${JSON.stringify(candles)}

Utilise des indicateurs comme RSI, MACD, bandes de Bollinger, Fibonacci, etc. Donne :
- Une tendance court terme (1h)
- Une tendance long terme (1-2 mois)
- Un plan de trading possible
- Des niveaux clés (résistance, support)

Réponds en français.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: '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',
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': 'Bearer TA_CLE_API_ICI',
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur OpenRouter');
  }
});

app.listen(port, () => {
  console.log(`Serveur backend sur http://localhost:${port}`);
});
