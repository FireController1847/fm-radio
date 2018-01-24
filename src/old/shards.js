const { ShardingManager } = require('discord.js');
const config = require('./config.js');
(new ShardingManager('./fm-radio.js', {'token': config.tokens.main}).spawn());