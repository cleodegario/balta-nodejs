const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = express.Router();

//conecta ao banco de dados
mongoose.connect('mongodb+srv://cassio:cassio@nodestr-twkon.azure.mongodb.net/test?retryWrites=true&w=majority')

//Carregar models
const Product = require('./models/product')

//Carega as rotas
const index = require('./routes/index');
const productRoute = require('./routes/product');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', index);
app.use('/products', productRoute);

module.exports = app;