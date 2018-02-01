const { ShardingManager } = require("discord.js");
const config = require("../Config.js");
new ShardingManager("../FMRadio.js", { token: config.tokens.main }).spawn();