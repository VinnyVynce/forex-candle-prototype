'use strict';

const async = require('async');
const Bittrex = require(process.env.PWD + '/api/markets/bittrex.js');
const MangoDB = require(process.env.PWD + '/utils/db.js');
const Transformer = require(process.env.PWD + '/harvester/transformer.js');

var processesArray = [];

exports.init = function (currentExchange) {
	MangoDB.getMarketsByExchange(currentExchange.symbol_id, function (markets) {
		console.log('Harvesting Bittrex!');
		async.each(markets, function (marketObject, callback) {
			var marketProcess = Object.create(Transformer.ProcessObject);
			marketProcess.init(currentExchange.name, marketObject.market, currentExchange.symbol_id, currentExchange.digits);
			processesArray.push(marketProcess);
			setInterval(function () { harvestBittrexMarket(marketProcess, processesArray, Transformer); }, 1000);
		});
	});
};

function harvestBittrexMarket (marketProcess) {
	Bittrex.getMarketHistory(marketProcess.getMarket(), function (err, res) {
		if (err || !res) {
			console.log('Failed to get in contact with the api in time');
		} else {
			if (res.success) {
				Transformer.dataScraper(res.result, marketProcess, Transformer);
			}
		}
	});
}
