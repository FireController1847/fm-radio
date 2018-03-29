const { Listener } = require('discord-akairo');

class ClientGuildCreate extends Listener {
  constructor() {
    super('clientGuildCreate', {
      emitter: 'client',
      event: 'guildCreate'
    });
  }

  exec(guild) {
    // Creating guilds disabled until ready for release.
    return;
    // eslint-disable-next-line no-unreachable
    this.client.mongo.createGuild(guild.id);
  }
}

module.exports = ClientGuildCreate;