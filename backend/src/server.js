import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import colors from 'colors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import sourceRoutes from './routes/sourceRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

dotenv.config();

const port = process.env.PORT || 8000;

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/sources', sourceRoutes);
app.use('/api/public', publicRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
