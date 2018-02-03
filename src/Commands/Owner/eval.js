const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, { name: "eval" });
  }
  execute(m) {
    if (!m.isOwner) return m.errors.notBotOwner();
    this.start(m);
    try {
      m.channel.send(`\`\`\`js\n${eval(this.client.getAllArguments([m.args[0]], m.content))}\n\`\`\``);
      return this.end(m);
    } catch (e) {
      m.channel.send(`\`\`\`js\n${e.stack}\n\`\`\``);
      return this.end(m);
    }
  }
};