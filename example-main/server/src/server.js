import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from './middleware/error.js';
import router from './routes/index.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());  // ✅ must be here before routes
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', router); // ✅ routes come after middleware

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
