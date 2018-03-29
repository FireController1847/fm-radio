const { Listener } = require('discord-akairo');

class ClientReady extends Listener {
  constructor() {
    super('clientReady', {
      emitter: 'client',
      event: 'ready'
    });
  }
  exec() {
    this.client.user.setActivity(`${this.client.akairoOptions.prefix}help`, {
      url: 'https://www.twitch.tv/firecontroller1847',
      type: 'STREAMING'
    });
    console.log(`Online and ready! This shard is on ${this.client.guilds.size} guilds.`);
  }
}

module.exports = ClientReady;