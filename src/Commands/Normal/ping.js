const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, { name: "ping" });
  }
  execute(m) {
    this.start(m);
    let content = this.client.getAllArguments([m.args[0]], m.cleanContent);
    if (!content) {
      m.channel.send(`Pong! The websocket took ${this.client.ping.toFixed(0)}ms to respond!`);
      return this.end(m);
    } else {
      if (!content.includes("{time}")) return m.channel.send(`I refuse to say anything without {time} in it!`);
      content = content.replace(/{time}/g, `${this.client.ping.toFixed(0)}ms`);
      m.channel.send(content);
      return this.end(m);
    }
  }
};