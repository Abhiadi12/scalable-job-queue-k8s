import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const WORKER_URL = process.env.WORKER_URL || 'http://localhost:4000';

app.post('/submit', async (req, res) => {
  try {
    const response = await fetch(`${WORKER_URL}/process`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body ?? {}),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'worker unreachable', detail: err.message });
  }
});

app.listen(PORT, () => console.log(`gateway listening on ${PORT}`));
