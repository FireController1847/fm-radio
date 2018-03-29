const { Listener } = require('discord-akairo');

class CommandHandlerCommandBlocked extends Listener {
  constructor() {
    super('commandHandlerCommandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked'
    });
  }
  exec(m, c, r) {
    if (r == 'testers') {
      return m.channel.send('<:vfdRedTick:378652441052315649> Woah there! You\'re not in the v7 testers list. You can\'t use this version yet!').catch(() => {
        // ...
      });
    }
  }
}

module.exports = CommandHandlerCommandBlocked;