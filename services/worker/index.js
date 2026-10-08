import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.post('/process', (req, res) => {
  const limit = req.body?.limit ?? 100000;

  let count = 0;
  for (let n = 2; n < limit; n += 1) {
    let isPrime = true;
    for (let d = 2; d * d <= n; d += 1) {
      if (n % d === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count += 1;
  }

  res.json({ limit, primeCount: count });
});

app.listen(PORT, () => console.log(`worker listening on ${PORT}`));
