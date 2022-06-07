const express = require('express');
const hbs = require('hbs');
const path = require('path');

const { PORT } = require('./configs/default');

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'static'));
hbs.registerPartials(path.resolve(__dirname, '/static/partials'));

const {
    authRoutes,
    userRoutes
} = require('./routes/index');

app.use(authRoutes);
app.use(userRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});
