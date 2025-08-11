import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sectionRoutes from "./routes/sectionRoutes.js";
import tripRoutes from './routes/tripRoutes.js';
import activityRoutes from './routes/activityRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/sections", sectionRoutes);
app.use('/api/trips', tripRoutes); 
app.use('/api/activities',activityRoutes);

app.get('/', (req, res) => {
  res.send('API is working!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
