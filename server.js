var logger = require('tracer').console();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000;
logger.info("server started at port: ", port);
app.listen(port, () => console.log(`Inventory Management app listening on port ${port}!`));