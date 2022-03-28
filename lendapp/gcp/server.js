import express from 'express';

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

app.use(function (req, res, next) {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Access-Control-Expose-Headers', '*');
  next();
});

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
