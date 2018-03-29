const { Listener } = require('discord-akairo');

class CommandHandlerError extends Listener {
  constructor() {
    super('commandHandlerError', {
      emitter: 'commandHandler',
      event: 'error'
    });
  }

  exec(e, m) {
    return m.channel.send(`There was an internal error running this command.\`\`\`js\n${e.stack || e}\n\`\`\``);
  }
}

module.exports = CommandHandlerError;