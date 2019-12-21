var MongoClient = require('mongodb').MongoClient;
var database = require(process.env.PWD + '/config.js');
var db;

exports.getDb = function () {
	return db;
};

exports.keepAlive = function (callback) {
	MongoClient.connect(database.url, function (err, client) {
		db = client.db(database.db);
		return callback(err);
	});
};

exports.getAllMarkets = function (callback) {
	db.collection('markets').find({}).toArray(function (err, result) {
		if (err) {
			console.log('An error occured with the database in function getAllMarkets');
		} else {
			return callback(result);
		}
	});
};

exports.getAllExchanges = function (callback) {
	db.collection('exchanges').find({}).toArray(function (err, result) {
		if (err) {
			console.log('An error occured with the database in function getAllExchanges');
		} else {
			return callback(result);
		}
	});
};

exports.getMarketsByExchange = function (symbol, callback) {
	let query = new RegExp('^' + symbol);
	db.collection('markets').find({'symbol': query}).toArray(function (err, result) {
		if (err) {
			console.log('An error occured with the database in function getMarketsByExchange');
		} else {
			return callback(result);
		}
	});
};
