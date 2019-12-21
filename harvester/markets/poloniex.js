'use strict';

const async = require('async');
const Poloniex = require(process.env.PWD + '/api/markets/poloniex.js');
const MangoDB = require(process.env.PWD + '/utils/db.js');
const Transformer = require(process.env.PWD + '/harvester/transformer.js');

var processesArray = [];

exports.init = function (currentExchange) {
	MangoDB.getMarketsByExchange(currentExchange.symbol_id, function (markets) {
		console.log('Harvesting Poloniex!');
		async.each(markets, function (marketObject, callback) {
			var marketProcess = Object.create(Transformer.ProcessObject);
			marketProcess.init(currentExchange.name, marketObject.market, currentExchange.symbol_id, currentExchange.digits);
			processesArray.push(marketProcess);
			setInterval(function () { harvestPoloniexMarket(marketProcess, processesArray, Transformer); }, 2000);
		});
	});
};

function harvestPoloniexMarket (marketProcess) {
	Poloniex.getMarketHistory(marketProcess.getMarket(), function (err, res) {
		if (err || !res) {
			console.log('Failed to get in contact with the api in time');
		} else {
			var result = [];
			async.each(res, function (r) {
				var row = {};
				row.Id = r.globalTradeID;
				row.TimeStamp = r.date;
				row.Quantity = r.amount;
				row.Price = r.rate;
				result.push(row);
			});
			Transformer.dataScraper(result, marketProcess, Transformer);
		}
	});
}
