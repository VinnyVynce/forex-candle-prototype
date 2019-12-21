const baseUrl = 'https://bittrex.com/api/v1.1/';
const request = require('request');

module.exports.getMarketHistory = function (market, callback) {
	let url = baseUrl + '/public/getmarkethistory?market=' + market;

	request(url, function (error, response, body) {
		if (!body || !response || response.statusCode !== 200) {
			var object = { error: error, response: response };
			return callback(object);
		} else {
			return callback(null, JSON.parse(body));
		}
	});
};

module.exports.getMarketSummary = function (market, callback) {
	let url = baseUrl + '/public/getmarketsummary?market=' + market;

	request(url, function (error, response, body) {
		if (!body || !response || response.statusCode !== 200) {
			var object = { error: error, response: response };
			return callback(object, null);
		} else {
			return callback(null, JSON.parse(body));
		}
	});
};
