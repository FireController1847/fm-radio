const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, { name: "prefix" });
  }
  execute(m) {
    this.start(m);
    m.channel.send(`The prefix for this server is \`${m.prefix}\`.`);
    return this.end(m);
  }
};