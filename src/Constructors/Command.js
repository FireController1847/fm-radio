module.exports = class Command {
  constructor(client, filePath, { name, aliases, desc }) {
    this.client = client;
    this.path = filePath;
    this.name = name;
    this.aliases = aliases || [];
    this.desc = desc || "No Description Available";
  }
  start(m) {
    return m.channel.startTyping();
  }
  end(m) {
    return m.channel.stopTyping(true);
  }
};