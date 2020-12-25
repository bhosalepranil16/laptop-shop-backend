require('dotenv').config()
const express = require('express');
require('./db/mongoose');
const app = express();
app.use(express.json());

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
	console.log(`Server is up on port ${port}`)
})