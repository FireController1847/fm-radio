const { Listener } = require('discord-akairo');

class ProcessUnhandledRejection extends Listener {
  constructor() {
    super('processUnhandledRejection', {
      emitter: 'process',
      event: 'unhandledRejection'
    });
  }

  exec(e) {
    return console.error(e);
  }
}

module.exports = ProcessUnhandledRejection;