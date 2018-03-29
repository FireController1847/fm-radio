const { Command } = require('discord-akairo');

class Support extends Command {
  constructor() {
    super('support', {
      aliases: ['support'],
      description: 'Returns an invite to the support server.',
      typing: true
    });
  }
  exec(m) {
    return m.channel.send(`Join our support server for quick and easy support :arrow_forward: https://discord.gg/0xxkiR1rO4zRsYLp`);
  }
}

module.exports = Support;