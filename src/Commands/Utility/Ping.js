const { Command } = require('discord-akairo');

class Ping extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      description: 'Gets the current speed of the WebSocket.',
      typing: true
    });
  }
  exec(m) {
    return m.channel.send(`The current speed of the WebSocket is ${this.client.ping.toFixed(0)}ms.`);
  }
}

module.exports = Ping;