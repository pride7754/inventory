var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var logger = require('tracer').console();

var getProductByCategory = async function (req, res) {
    logger.info("inside getProductByCategory");
    let cat = req.params.category;
    let _db;
    await MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
      _db = db.db("inventory");
      logger.info(cat)
      _db.collection("product").find({ 'product_category': { $elemMatch: { $eq: cat } } }).toArray(function (err, docs) {
        if (err) throw err;
        if (docs) {
          logger.info("found doc.");
          res.json(docs);
        }
      });
    });
};

module.exports = {
    getProductByCategory
};