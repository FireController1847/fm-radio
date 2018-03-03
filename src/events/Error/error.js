const Event = require('../../structures/Event.js');

class Error extends Event {
  constructor(client, path) {
    super(client, path, { event: 'error' });
  }
  execute(be) {
    this.client.error(`Internal Bot Error`, be);
  }
}

module.exports = Error;