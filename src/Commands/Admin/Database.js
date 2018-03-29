const { Command } = require('discord-akairo');

class Database extends Command {
  constructor() {
    super('database', {
      aliases: ['database', 'db'],
      description: 'The base command for getting database information.',
      args: [
        {
          id: 'infoType',
          type: 'lowercase'
        },
        {
          id: 'content',
          match: 'rest'
        }
      ]
    });
  }
  exec(m, args) {
    if (!args.infoType) {
      return m.channel.send('Invalid Option. Please choose `debug`, `reset`, or `help`. ' +
        `Example: \`${this.handler.prefix}${this.id} reset\``);
    } else if (args.infoType == 'debug') {
      return this.handler._handleCommand(m, args.content, this.handler.modules.get('dbdebug'));
    } else if (args.infoType == 'reset') {
      return this.handler._handleCommand(m, args.content, this.handler.modules.get('dbreset'));
    } else if (args.infoType == 'help') {
      return m.channel.send('The help command is still under construction.');
    }
  }
}

module.exports = Database;