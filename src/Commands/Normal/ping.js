const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {"name": "ping"});
  }
  execute(m) {
    let content = this.client.getAllArguments([m.args[0]], m.cleanContent);
    if (!content) {
      return m.channel.send(`Pong! The websocket took ${this.client.ping.toFixed(0)}ms to respond!`);
    } else {
      if (!content.includes('{time}')) return m.channel.send(`I refuse to say anything without {time} in it!`);
      content = content.replace(/{time}/g, this.client.ping.toFixed(0) + 'ms');
      return m.channel.send(content);
    }
  }
};