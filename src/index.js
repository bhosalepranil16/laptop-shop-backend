require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/images', express.static('images'));

const port = process.env.PORT;

const laptopRoutes = require('./routes/laptop');
const ownerRoutes = require('./routes/owner');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');

app.use(laptopRoutes);
app.use(ownerRoutes);
app.use(userRoutes);
app.use(orderRoutes);

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
