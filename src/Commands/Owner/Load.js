const { Command } = require('discord-akairo');

class Load extends Command {
  constructor() {
    super('load', {
      aliases: ['load'],
      ownerOnly: true,
      args: [
        {
          id: 'commandID'
        }
      ]
    });
  }
  exec(m, args) {
    if (!args.commandID) {
      return m.channel.send('You must include a command ID!');
    }
    const command = this.handler.add(args.commandID);
    if (!command) return m.channel.send(`Unable to find command \`${args.commandID}\``);
    return m.channel.send(`Added command \`${args.commandID}\`.`);
  }
}

module.exports = Load;