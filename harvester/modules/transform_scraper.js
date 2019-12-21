'use strict';

const async = require('async');
const Loader = require(process.env.PWD + '/harvester/loader.js');

exports.dataScraper = function (data, currentProcess, Transformer) {
	var transID = currentProcess.getLastTransactionID();
	data = dataCrusher(data, transID, currentProcess);
	if (data !== false) {
		var allTimestamps = currentProcess.getAllTimestamps();

		async.each(data, function (result, callback) {
			var currentMins = Transformer.getTimeInMinutes(result.TimeStamp);

			async.each(allTimestamps, function (timeStamp, callback) {
				if ((timeStamp.initialized === false) && (currentMins % timeStamp.period === 0)) {
					newCandle(result, Transformer, currentProcess, timeStamp);
					currentProcess.setInitialization(timeStamp);
				}

				var candleArray = timeStamp.array;
				if (candleArray.length !== 0) {
					var currentCandle = candleArray[candleArray.length - 1];

					if (currentMins - currentCandle.getCandleTimeInMinutes() >= timeStamp.period) {
						newCandle(result, Transformer, currentProcess, timeStamp);
					} else {
						currentCandle.incrementVolume(result.Quantity);
						if (result.Price > currentCandle.getHighest()) { currentCandle.setHighest(result.Price); }
						if (result.Price < currentCandle.getLowest()) { currentCandle.setLowest(result.Price); }
						currentCandle.setClose(result.Price);
						Loader.init(currentProcess, timeStamp.period, result.TimeStamp, currentCandle, 'edit', timeStamp);
					}
				}
			});
		});
	}
};

function newCandle (result, Transformer, currentProcess, timeStamp) {
	var candle = Object.create(Transformer.CandleObject);
	candle.init(result.Price, result.Price, result.Price, result.Price, result.Quantity, result.TimeStamp);
	currentProcess.insertCandle(candle, timeStamp.array, timeStamp.limit);
	Loader.init(currentProcess, timeStamp.period, result.TimeStamp, candle, 'append');
}

function dataCrusher (data, transID, currentProcess) {
	if (transID !== null) {
		var index = data.findIndex(function (x) { return x.Id <= transID; });
		if (index !== -1)	{
			data = data.slice(0, index);
		}
		if (index !== 0) {
			currentProcess.setLastTransactionID(data[0].Id);
			data = data.reverse();
		} else {
			data = false;
		}
	} else {
		currentProcess.setLastTransactionID(data[0].Id);
		data = data.reverse();
	}
	return data;
}
