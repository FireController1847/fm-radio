const Event = require('../structures/Event.js');

class Disconnect extends Event {
  constructor(client, path) {
    super(client, path, { event: 'disconnect' });
  }
  execute(ce) {
    this.client.debug(`Disconnected from Discord, restarting...`, `Code ${ce.code}`, `Reason ${ce.reason}`);
    process.exit();
  }
}

module.exports = Disconnect;