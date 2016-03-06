'use strict';

var fs = require('fs'),
    path = require('path'),
    nconf = require('nconf');

nconf.env().argv();

nconf.file('local', path.join(__dirname, 'config.local.json'));
nconf.file(path.join(__dirname, 'config.json'));

module.exports = nconf;
