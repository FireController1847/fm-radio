const { ShardingManager } = require('discord.js');
// const { token } = require('./Data/Tokens.js');
// One shard only for testing purposes. Replace with { token } when done.
const sm = new ShardingManager('./Client.js', { totalShards: 1 });
sm.spawn();