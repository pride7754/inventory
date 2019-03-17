var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var logger = require('tracer').console();

/* function to get all categories from collection category.*/
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
    getAllCategories
};



