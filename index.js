import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import booksRoute from './routes/booksRoute.js';
import ConnectMongoDb from './config/db.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware for parsing request body
app.use(express.json());
app.use(cors());

// Connect to MongoDB
ConnectMongoDb().catch(error => {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1); // Exit process with failure
});

// Use routes
app.use('/books', booksRoute);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "../backend/dist")));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "../backend/dist/index.html"));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running successfully on port ${port}`);
});
