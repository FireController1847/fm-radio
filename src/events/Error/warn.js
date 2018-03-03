const Event = require('../structures/Event.js');

class Warn extends Event {
  constructor(client, path) {
    super(client, path, { event: 'warn' });
  }
  execute(bw) {
    this.client.error(`Internal Bot Warning`, bw);
  }
}

module.exports = Warn;