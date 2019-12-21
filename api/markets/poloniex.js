const baseUrl = 'https://poloniex.com/';
const request = require('request');

module.exports.getMarketHistory = function (market, callback) {
	market = market.replace('-', '_');
	let url = baseUrl + 'public?command=returnTradeHistory&currencyPair=' + market;
	request(url, function (error, response, body) {
		if (error !== null) {
			response = JSON.parse(body);
			if (response.error !== undefined) {
				var object = { error: response.error, response: response };
				return callback(object);
			} else {
				return callback(null, response);
			}
		} else {
			console.log('Poloniex api error during html request.');
		}
	});
};
