var logger = require('tracer').console();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

var categoryService = require('./services/category');
var productService = require('./services/products');

logger.info("server started at port: ", port);
//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//api
app.post('/addcategory', categoryService.addCategory);
app.post('/addproduct', productService.addProduct);
app.get('/getcategories', categoryService.getAllCategories);
app.get('/getproduct/:category', productService.getProductByCategory);


app.listen(port, () => console.log(`Inventory Management app listening on port ${port}!`));

