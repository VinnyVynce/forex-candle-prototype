'use strict';

const async = require('async');
const MangoDB = require(process.env.PWD + '/utils/db.js');

MangoDB.getAllExchanges(function (results) {
	async.each(results, function (market, callback) {
		require(process.env.PWD + '/harvester/markets/' + market.name.toLowerCase() + '.js').init(market);
	});
});
