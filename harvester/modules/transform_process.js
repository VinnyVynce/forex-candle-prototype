'use strict';

exports.ProcessObject = {
	// Private namespace
	_exchange: null,
	_market: null,
	_symbol: null,
	_digits: null,
	_lastTransactionID: null,
	_m1: null,
	_m5: null,
	_m15: null,
	_m30: null,
	_h1: null,
	_h4: null,
	_d1: null,
	_w1: null,
	_mn: null,

	// Constructor Function
	init: function (exchange, market, symbol, digits) {
		this._exchange = exchange;
		this._market = market;
		this._symbol = symbol;
		this._digits = digits;
		this._m1 = {'name': 'M1', 'array': [], 'initialized': false, 'period': 1, 'limit': 5};
		this._m5 = {'name': 'M5', 'array': [], 'initialized': false, 'period': 5, 'limit': 3};
		this._m15 = {'name': 'M15', 'array': [], 'initialized': false, 'period': 15, 'limit': 2};
		this._m30 = {'name': 'M30', 'array': [], 'initialized': false, 'period': 30, 'limit': 2};
		this._h1 = {'name': 'H1', 'array': [], 'initialized': false, 'period': 60, 'limit': 4};
		this._h4 = {'name': 'H4', 'array': [], 'initialized': false, 'period': 240, 'limit': 6};
		this._d1 = {'name': 'D1', 'array': [], 'initialized': false, 'period': 1440, 'limit': 31};
		this._w1 = {'name': 'W1', 'array': [], 'initialized': false, 'period': 10080, 'limit': 4};
		this._mn = {'name': 'MN', 'array': [], 'initialized': false, 'period': 43830, 'limit': 1};
	},

	getChild: function (name) {
		switch (name) {
			case 'M1': return false;
			case 'M5': return this._m1;
			case 'M15': return this._m5;
			case 'M30': return this._m15;
			case 'H1': return this._m30;
			case 'H4': return this._h1;
			case 'D1': return this._h4;
			case 'W1': return this._d1;
			case 'MN': return this._w1;
		}
	},

	getLastTransactionID: function () {
		return this._lastTransactionID;
	},

	getAllTimestamps: function () {
		return [this._m1, this._m5, this._m15, this._m30, this._h1, this._h4, this._w1, this._mn];
	},

	getSymbol: function () {
		return this._symbol;
	},

	getDigits: function () {
		return this._digits;
	},

	setLastTransactionID: function (lTID) {
		this._lastTransactionID = lTID;
	},

	setInitialization: function (timeStamp) {
		timeStamp.initialized = true;
	},

	insertCandle: function (candle, candleArray, limit) {
		if (candleArray.length !== limit) {
			candleArray.push(candle);
		}	else {
			candleArray.shift();
			candleArray.push(candle);
		}
	},

	getMarket: function () {
		return this._market;
	}
};
