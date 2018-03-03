const Event = require('../structures/Event.js');
const { messages } = require('../util/Config.js');

class Ready extends Event {
  constructor(client, path) {
    super(client, path, { event: 'ready' });
  }
  execute() {
    this.client.debug(`Online and ready! Currently on ` +
      `${this.client.guilds.size} guild${this.client.guilds.size == 1 ? '' : 's'}.`);
    this.client.user.setPresence(`dnd`, { activity: { name: `${messages.prefix}help`, type: 'STREAMING' } });
  }
}

module.exports = Ready;