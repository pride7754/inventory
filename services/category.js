var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var logger = require('tracer').console();

/** function for schema validation for add category payload. */
var schemaValidatorForAddCategory = function (inputPayload) {
    let schema_err = "Schema error for input Payload.";
    if (inputPayload) {
        if (!inputPayload.hasOwnProperty("category_id") || !Number.isSafeInteger(inputPayload.category_id)) { //.isSafeInteger())) {
            logger.info("category id err.");
            schema_err = "Category id is required and should be numeric.";
            return schema_err;
        }
        if (!inputPayload.hasOwnProperty("category_name") || typeof(inputPayload.category_name) !== "string") {
            logger.info("category name err.");
            schema_err = "Category name is required and should be string.";
            return schema_err;
        }
        if (!inputPayload.hasOwnProperty("child_categories") || !(Array.isArray(inputPayload.child_categories))) {
            logger.info("child category err.");
            schema_err = "Child categories field is required. It should be an array of multiple categories. It could be empty.";
            return schema_err;
        }
        return null;
    } else {
        return schema_err;
    }
};

/** function to add Category */
var addCategory  = async function (req, res) {
    logger.info("inside addCategory");
    let categoryDetails = null;
    let schemaValidator = schemaValidatorForAddCategory(req.body);
    if(!schemaValidator) {
        logger.info("Input payload is right.");
        categoryDetails = req.body;
        await MongoClient.connect(url, { useNewUrlParser: true }, function (_err, client) {
            _db = client.db("inventory");
            _db.collection("category").insertOne(categoryDetails, function (err, resp) {
                if (err) {
                    logger.info("error in inserting category.", JSON.stringify(err));
                    res.send(err.message);
                }
                logger.info("inserted category successfully.");
                res.send("Successfully inserted category.");
                res.end();
            });
            client.close();
        });
    } else {
        res.send(schemaValidator);
        res.end();
    }
};

/** function to get all categories.*/
var getAllCategories  = async function (req, res) {
    logger.info("inside getAllCategories");
    await MongoClient.connect(url, { useNewUrlParser: true }, function (_err, client) {
        _db = client.db("inventory");
        _db.collection("category").find({},{ projection: { _id: 0}}).toArray(function (err, docs) {
          if (err) {
              logger.info("Error in inserting category.");
              res.send(err.message);
          }
          if (docs) {
            logger.info("found record.");
            res.json(docs);
          }
        });
        client.close();
    });
};

module.exports= {
    addCategory,
    getAllCategories
};



