import express from 'express';
import connectDB from './db/index.js';
import notesRoutes from './routes/notes.routes.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: "Notes API Working " });
});

// Routes
app.use('/notes', notesRoutes);

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();