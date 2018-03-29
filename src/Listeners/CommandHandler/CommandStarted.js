const { Listener } = require('discord-akairo');

class CommandHandlerCommandStarted extends Listener {
  constructor() {
    super('commandHandlerCommandStarted', {
      emitter: 'commandHandler',
      event: 'commandStarted'
    });
  }

  exec(m, c) {
    if (['info', 'database'].includes(c.id)) return;
    if (m.guild) this.client.debug(`User ${m.author.username} (${m.author.id}) issued server command ${this.client.akairoOptions.prefix}${c.id} in ${m.guild.name} (${m.guild.id}), #${m.channel.name}`);
    else this.client.debug(`User ${m.author.username} (${m.author.id}) issued private command ${this.client.akairoOptions.prefix}${c.id}.`);
  }
}

module.exports = CommandHandlerCommandStarted;