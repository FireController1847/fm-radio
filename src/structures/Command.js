class Command {
  constructor(client, path, { aliases, desc, name }) {
    this.aliases = aliases || [];
    this.client = client;
    this.desc = desc || 'No Description Available';
    this.name = name;
    this.path = path;
  }
  start(channel) {
    return channel.startTyping();
  }
  end(channel) {
    return channel.stopTyping(true);
  }
}

module.exports = Command;