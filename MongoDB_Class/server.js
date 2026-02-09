import express from 'express'
import connectDB from './db/index.js'
import Book from './models/Book.model.js';

const app = express();
app.use(express.json());

// Health check
app.get('/', (req,res)=>{
    res.send("API Working")
})

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

const startServer = async () => {
  await connectDB();
  app.listen(3000, () =>
    console.log(`Server running on port`)
  );
};

startServer();