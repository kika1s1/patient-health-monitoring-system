import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './config/database.js'; 
import authRoutes from './routes/authRoutes.js'; 
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js'; 
import messageRoutes from './routes/messageRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js'; 
import utilityRoutes from './routes/utilityRoutes.js'; 
import notFound from './utils/notFound.js';
import errorHandler from './utils/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:8080",
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

connectDB();

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/patients', patientRoutes);

app.use('/api/v1/doctors', doctorRoutes);

app.use('/api/v1/messages', messageRoutes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/notifications', notificationRoutes);

app.use('/api/v1/appointments', appointmentRoutes);

app.use('/api/v1/utility', utilityRoutes);

app.get('/', (req, res) => res.send('API Running'));

app.use(notFound)

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});