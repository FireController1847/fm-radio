const { Command } = require('discord-akairo');

class Invite extends Command {
  constructor() {
    super('invite', {
      aliases: ['invite'],
      description: 'Returns the invite for the bot.',
      typing: true
    });
  }
  exec(m) {
    return m.channel.send('<https://discordapp.com/oauth2/authorize?permissions=36768768&scope=bot&client_id=255933783293820928>');
  }
}

module.exports = Invite;