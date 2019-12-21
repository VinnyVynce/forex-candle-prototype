# Forex candle prototype #

This repository is for the Forex candle prototype. It's written completly in Javascript (NodeJS) and use MongoDB as a database.
This prototype mission is to harvest various markets accross multiples exchanges using their APIs. The project is shipped as is, I do not plan to work on it anymore.

### Before getting started ###

First download every node modules:
`npm install`

Launch the Mongo daemon:
`mongod`

Add environement variable for metatrader:
`export HST_PATH="/path/to/metatrader/history/folder"`

Launch the nodejs application:
`node app.js`