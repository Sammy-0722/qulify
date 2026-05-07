require('dotenv').config();
const express = require('express');
const connectDB = require('./db')
const cors = require('cors');
const queueRoutes = require('./routes/queue');
const authRoutes = require('./routes/auth');



const app = express();

app.use(cors({
  origin: 'https://qulify.vercel.app',
  credentials: true
}))
app.use(express.json());
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);

const PORT = process.env.PORT ||5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});