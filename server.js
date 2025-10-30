require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedbacks');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);

app.use('/api/auth', authRoutes);
app.use('/api/feedbacks', feedbackRoutes);

app.get('/', (req, res) => res.send('Feedback API is running'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
