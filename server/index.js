const express = require('express');
const cors = require('cors');
require('dotenv').config();

const staffRoutes = require('./routes/staffRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.use('/api/staff', staffRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
