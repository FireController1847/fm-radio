const { Command } = require('discord-akairo');

class Info extends Command {
  constructor() {
    super('info', {
      aliases: ['info'],
      description: 'The base command for getting information.',
      args: [
        {
          id: 'infoType',
          type: 'lowercase'
        },
        {
          id: 'content',
          match: 'rest'
        }
      ],
      clientPermissions: ['EMBED_LINKS']
    });
  }
  exec(m, args) {
    if (!args.infoType) {
      return m.channel.send('Invalid Option. Please choose `bot`, `shard`, or `help`. ' +
        `Example: \`${this.handler.prefix}${this.id} bot\``);
    } else if (args.infoType == 'shard') {
      return this.handler._handleCommand(m, args.content, this.handler.modules.get('shardinfo'));
    } else if (args.infoType == 'bot') {
      return this.handler._handleCommand(m, args.content, this.handler.modules.get('botinfo'));
    } else if (args.infoType == 'help') {
      return m.channel.send('The help command is still under construction.');
    }
  }
}

module.exports = Info;