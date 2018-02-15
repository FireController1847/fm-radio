const { ShardingManager } = require('discord.js');
const token = require('./tokens.key');
const sm = new ShardingManager('./FMRadio.js', { token });
sm.spawn();