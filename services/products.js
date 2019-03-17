var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var logger = require('tracer').console();

/** function to get product by category name */
var getProductByCategory = async function (req, res) {
    logger.info("inside getProductByCategory");
    let cat = req.params.category;
    let _db;
    await MongoClient.connect(url, { useNewUrlParser: true }, function (_err, client) {
        if (_err) {
            logger.info("error in database connection while fetching product.", JSON.stringify(_err));
            res.send(_err.message);
        }
        _db = client.db("inventory");
        _db.collection("product").find({ 'product_category': { $elemMatch: { $eq: cat } } }).toArray(function (err, docs) {
            if (err) throw err;
            if (docs) {
                logger.info("found doc.");
                res.json(docs);
            }
        });
        client.close();
    });
};
/** function to validate schema for product payload. */
var schemaValidatorForAddProduct = function (inputPayload) {
    let schema_err = "Schema error for input Payload.";
    if (inputPayload) {
        if (!inputPayload.hasOwnProperty("product_id") || !Number.isSafeInteger(inputPayload.product_id)) { //.isSafeInteger())) {
            logger.info("product id err.");
            schema_err = "Product id is required and should be numeric.";
            return schema_err;
        }
        if (!inputPayload.hasOwnProperty("product_name") || typeof (inputPayload.product_name) !== "string") {
            logger.info("product name err.");
            schema_err = "Product name is required and should be string.";
            return schema_err;
        }
        if (!inputPayload.hasOwnProperty("product_category") || !(Array.isArray(inputPayload.product_category)) || inputPayload.product_category.length <= 0) {
            logger.info("product category err.");
            schema_err = "Product should have atleast one category. It should be an array of multiple categories.";
            return schema_err;
        }
        if (!inputPayload.hasOwnProperty("product_price") || inputPayload.product_price < 0) {
            schema_err = "Product price should be greater than 0.";
            return schema_err;
        }
        return null;
    } else {
        return schema_err;
    }
};

/** function to add product. */
var addProduct = async function (req, res) {
    logger.info("inside addProduct");
    let schemaValidator = schemaValidatorForAddProduct(req.body);

    if (!schemaValidator) {
        logger.info("Input payload is right.");
        productDetails = req.body;
        await MongoClient.connect(url, { useNewUrlParser: true }, function (_err, client) {
            if (_err) {
                logger.info("error in database connection while inserting product.", JSON.stringify(_err));
                res.send(_err.message);
            }
            _db = client.db("inventory");
            _db.collection("product").insertOne(productDetails, function (err, resp) {
                if (err) {
                    logger.info("error in inserting product.", JSON.stringify(err));
                    res.send(err.message);
                }
                logger.info("inserted product successfully.");
                res.send("Successfully inserted product.");
                res.end();
            });
            client.close();
        });
    } else {
        res.send(schemaValidator);
        res.end();
    }
};

/** function to update product details. */
var updateProduct = async function (req, res) {
    logger.info("inside updateProduct");
    let id = req.params.product_id;
    userData = {};
    if (req.body.hasOwnProperty("product_id") && Number.isSafeInteger(req.body.product_id)) {
        logger.info("found product id in payload.");
        userData.product_id = req.body.product_id;
    }
    if (req.body.hasOwnProperty("product_name") && typeof (req.body.product_name) === "string") {
        userData.product_name = req.body.product_name;
    }
    if (req.body.hasOwnProperty("product_category") && Array.isArray(req.body.product_category) && req.body.product_category.length > 0) {
        userData.product_category = [];
        userData.product_category.push.apply(userData.product_category, req.body.product_name);
    }
    if (req.body.hasOwnProperty("product_price") && req.body.product_price > 0) {
        userData.product_price = req.body.product_price;
    }

    if (userData) {
        await MongoClient.connect(url, { useNewUrlParser: true }, function (_err, client) {
            if (_err) {
                logger.info("error in database connection while updating product.", JSON.stringify(_err));
                res.send(_err.message);
            }
            _db = client.db("inventory");
            logger.info(typeof (parseInt(id)));
            _db.collection("product").findOneAndUpdate({ "product_id": parseInt(id) }, { $set: userData }, { returnOriginal: false }, function (err, docs) {
                if (err) {
                    logger.info("error while updating document.");
                    res.send(err.message);
                }
                if (docs) {
                    logger.info("updated doc.");
                    res.json(docs.value);
                }
            });
            client.close();
        });
    }
};

module.exports = {
    getProductByCategory,
    addProduct,
    updateProduct
};

