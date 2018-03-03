const { ShardingManager } = require('discord.js');
const sm = new ShardingManager('./client/FMRadio.js', { totalShards: 20 });
sm.spawn();