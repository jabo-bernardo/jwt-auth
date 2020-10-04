if(process.env.NODE_ENV !== 'production') 
	require('dotenv').config();

/**
 * Module Imports
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');

/**
 * Express Configuration
 */
const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

/**
 * Database Connection
 */
console.info('Connecting to database...');
mongoose.connect(process.env.DATABASE_URL, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

const db = mongoose.connection;

/**
 * Triggers when something wrong occured while 
 * connecting to the database.
 * 
 * If ever there is an error while connecting the
 * database the server won't start
 */
db.on('error', err => console.error(err));
/**
 * Triggers when the database connection was made.
 * 
 * This also boots up the server to ensure that the
 * database connection is running when the server is 
 * started.
 */
db.once('open', () => {
	console.info(`Successfully connected to database.`);
	const PORT = process.env.PORT || 8080;
	app.listen(PORT, () => console.info(`Server ignited at port ${PORT}`));
})

/**
 * Routing
 */
const indexRoute = require('./routes/index');
const usersRoute = require('./routes/users');

app.use('/', indexRoute);
app.use('/api/v1/users', usersRoute);