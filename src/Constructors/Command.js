module.exports = class Command {
  constructor(client, filePath, { name, aliases }) {
    this.client = client;
    this.path = filePath;
    this.name = name;
    this.aliases = aliases || [];
  }
  start(m) {
    return m.channel.startTyping();
  }
  end(m) {
    return m.channel.stopTyping();
  }
};