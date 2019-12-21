'use strict';

const fs = require('fs');
const Struct = require('struct');

const headerSize = 148;
const barSize = 60;
const version = 401;
const copyright = '(C)opyright 2003, MetaQuotes Software Corp.';

const Header = Struct()
    .word32Sle('version')
    .chars('copyright', 64, 'UTF-8')
    .chars('symbol', 12, 'UTF-8')
    .word32Sle('period')
    .word32Sle('digits')
    .word32Sle('timesign')
    .word32Sle('last_sync')
    .chars('unused', 52, 'UTF-8');

const Bar = Struct()
    .word64Ule('ctm')
    .doublele('open')
    .doublele('high')
    .doublele('low')
    .doublele('close')
    .word64Sle('volume')
    .word32Sle('spread')
    .word64Sle('real_volume');

exports.createFile = function (filename, currentProcess, period, currentTime) {
	var fd = fs.openSync(filename, 'w');
	var headerBuffer = Buffer.alloc(headerSize);
	Header._setBuff(headerBuffer);

	Header.fields.version = version; // database version
	Header.fields.copyright = copyright; // copyright info
	Header.fields.symbol = currentProcess.getSymbol() + currentProcess.getMarket(); // symbol name
	Header.fields.period = period; // symbol timeframe
	Header.fields.digits = 6; // digits
	Header.fields.timesign = currentTime; // timesign of the database creation
	Header.fields.last_sync = currentTime; // the last synchonization time

	fs.writeSync(fd, Header.buffer(), 0, headerSize, 0);
	fs.closeSync(fd);
};

exports.appendBar = function (filename, candle, currentTime) {
	var fd = fs.openSync(filename, 'a');
	var barBuffer = Buffer.alloc(barSize);

	Bar._setBuff(barBuffer);
	Bar.fields.ctm = currentTime; // Bar start time
	Bar.fields.open = candle.getOpen(); // open price
	Bar.fields.high = candle.getHighest(); // highest price
	Bar.fields.low = candle.getLowest(); // lowest price
	Bar.fields.close = candle.getClose(); // close price
	Bar.fields.volume = candle.getVolume(); // tick count
	Bar.fields.spread = 0; // spread
	Bar.fields.real_volume = 0; // real volume

	fs.writeSync(fd, Bar.buffer(), 0, barSize);
	fs.closeSync(fd);
};

exports.editLastBar = function (filename, candle, currentTime, currentProcess, timeStamp) {
	var barBuffer = Buffer.alloc(barSize);
	var fd = fs.openSync(filename, 'a');

	var statObject = fs.statSync(filename);
	var from = statObject.size - barSize;

	fs.truncateSync(filename, from);

	Bar._setBuff(barBuffer);
	Bar.fields.ctm = currentTime; // Bar start time
	Bar.fields.open = candle.getOpen(); // open price
	Bar.fields.high = candle.getHighest(); // highest price
	Bar.fields.low = candle.getLowest(); // lowest price
	Bar.fields.close = candle.getClose(); // close price
	Bar.fields.volume = candle.getVolume(); // tick count
	Bar.fields.spread = 0; // spread
	Bar.fields.real_volume = 0; // real volume

	fs.writeSync(fd, Bar.buffer(), 0, barSize);
	fs.closeSync(fd);
};
/*
function readHst(filename, from) {
  var fd = fs.openSync(filename, 'r');
  var barBuffer = Buffer.alloc(barSize);
  fs.readSync(fd, barBuffer, 0, barSize, from);
  Bar._setBuff(barBuffer);

  console.log('Start Time : ' + moment.unix(Bar.fields.ctm).utc(false).format('YYYY-MM-DD HH:mm:ss'));
  console.log('Start Time : ' + Bar.fields.ctm);
  console.log('Open : ' + Bar.fields.open);
  console.log('High : ' + Bar.fields.high);
  console.log('Low : ' + Bar.fields.low);
  console.log('Close : ' + Bar.fields.close);
  console.log('Volume : ' + Bar.fields.volume);
  console.log('Spread : ' + Bar.fields.spread);
  console.log('Real Volume : ' + Bar.fields.real_volume);
  console.log();

  fs.closeSync(fd);
}
*/
