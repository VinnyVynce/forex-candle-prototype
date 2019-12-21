module.exports = Object.assign(
    {},
    require(process.env.PWD + '/harvester/modules/transform_candles.js'),
    require(process.env.PWD + '/harvester/modules/transform_process.js'),
    require(process.env.PWD + '/harvester/modules/transform_scraper.js')
);
