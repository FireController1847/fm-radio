const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: "prefix",
      desc: "Finds the current prefix of the guild this command is run in."
    });
  }
  execute(m) {
    if (m.isDM) return m.errors.noDMSupport();
    this.start(m);
    m.channel.send(`The prefix for this server is \`${m.prefix}\`.`);
    return this.end(m);
  }
};