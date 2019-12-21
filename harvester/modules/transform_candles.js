exports.CandleObject = {
	// Private namespace
	_open: null,
	_highest: null,
	_lowest: null,
	_close: null,
	_volume: null,
	_time: null,

	// Constructor Function
	init: function (open, high, low, close, vol, tim) {
		this._open = open;
		this._highest = high;
		this._lowest = low;
		this._close = close;
		this._volume = vol;
		this._time = new Date(tim.replace(/\d\d\.\d\d\d/g, '00.000'));
	},

  // Get functions
	getCandleTimeInMinutes: function () {
		return Math.floor((this._time).getTime() / 60000);
	},

	getOpen: function () {
		return this._open;
	},

	getHighest: function () {
		return this._highest;
	},

	getLowest: function () {
		return this._lowest;
	},

	getClose: function () {
		return this._close;
	},

	getVolume: function () {
		return this._volume;
	},

  // Set functions
	setOpen: function (open) {
		this._open = open;
	},

	setHighest: function (high) {
		this._highest = high;
	},

	setLowest: function (low) {
		this._lowest = low;
	},

	setClose: function (close) {
		this._close = close;
	},

	incrementVolume: function (v) {
		this._volume = this._volume + v;
	}
};

// Get the parameter timeString (UTC date) and send it back in minutes.
exports.getTimeInMinutes = function (timeString) {
	var d = new Date(timeString);
	return Math.floor(d.getTime() / 60000);
};
