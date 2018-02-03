const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: "getstarted",
      desc: "Helps users get started using the bot for the first time."
    });
  }
  execute(m) {
    this.start(m);
    m.channel.send(`#1: Fuck off. I need to finish this command don't let me forget xD`);
    return this.end(m);
  }
};