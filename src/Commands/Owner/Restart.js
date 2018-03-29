const { Command } = require('discord-akairo');

class Restart extends Command {
  constructor() {
    super('restart', {
      aliases: ['restart'],
      ownerOnly: true,
      args: [
        {
          id: 'shardID',
          type: 'number'
        }
      ]
    });
  }
  async exec(m, args) {
    if (!this.client.shard) {
      await m.channel.send(`Restarting.`);
      return process.exit();
    }
    if (!args.shardID) {
      await m.channel.send(`Restarting shard ${this.client.shard.id}.`);
      return process.exit();
    }
    await m.channel.send(`Attempting to restart shard ${args.shardID}.`);
    await this.client.shard.broadcastEval(`if (this.shard.id == ${args.shardID.toString()}) process.exit();`);
  }
}

module.exports = Restart;