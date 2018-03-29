const { Command } = require('discord-akairo');

class Donate extends Command {
  constructor() {
    super('donate', {
      aliases: ['donate'],
      description: 'Gives the user about donations and how to donate.',
      typing: true
    });
  }
  exec(m) {
    return m.channel.send('This command is still under development.');
  }
}

module.exports = Donate;