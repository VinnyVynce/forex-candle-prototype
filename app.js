'use strict';

const MangoDB = require(process.env.PWD + '/utils/db.js');

MangoDB.keepAlive(function () {
	require(process.env.PWD + '/harvester/extractor.js');
});
