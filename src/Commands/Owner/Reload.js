const { Command } = require('discord-akairo');

class Reload extends Command {
  constructor() {
    super('reload', {
      aliases: ['reload'],
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
    } else if (args.commandID == 'all') {
      this.handler.reloadAll();
      return m.channel.send('Reloaded all commands.');
    }
    this.handler.reload(args.commandID);
    return m.channel.send(`Reloaded command \`${args.commandID}\`.`);
  }
}

module.exports = Reload;