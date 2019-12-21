'use strict';

const fs = require('fs');
const moment = require('moment');
const hst = require(process.env.PWD + '/harvester/modules/loader_hstparser.js');

exports.init = function (currentProcess, period, time, candle, operation, timeStamp, callback) {
	var currentTime = moment.utc(time.replace(/\d\d\.\d\d\d/g, '00.000')).unix(); // Remove seconds & milliseconds

	if (process.env.HST_PATH === undefined || process.env.HST_PATH === '') {
		console.log('The HST_PATH variable needs to be set to continue further. The application will stop.');
		process.exit();
	}

	if (fs.existsSync(process.env.HST_PATH) === false) {
		fs.mkdirSync(process.env.HST_PATH);
	}

	var filename = process.env.HST_PATH + currentProcess.getSymbol() + currentProcess.getMarket() + period + '.hst';

	if (fs.existsSync(filename) === false) {
		hst.createFile(filename, currentProcess, period, currentTime);
	}

	if (operation === 'append') {
		hst.appendBar(filename, candle, currentTime);
	} else if (operation === 'edit') {
		hst.editLastBar(filename, candle, currentTime, currentProcess, timeStamp);
	}
};
