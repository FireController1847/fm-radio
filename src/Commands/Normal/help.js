const Command = require("../../Constructors/Command.js");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: "help",
      desc: "Gives the user information on how to use the bot.",
      aliases: ["?"]
    });
  }
  execute(m) {
    this.start(m);
    if (!m.argsLower[1]) {
      m.channel.send(`Hello! I'm FM Radio, here to serve you the best music ` +
        `available on Discord. To see the full list of commands without their descriptions, ` +
        `run \`${m.prefix}commands\`. To get help with a specific command, run ` +
        `\`${m.prefix}help <command name>\`. ` +
        `If this is your first time using the bot, run \`${m.prefix}getstarted\`.`
      );
      return this.end(m);
    }
    const cmd = this.client.getCommand(m.argsLower[1]);
    if (!cmd) {
      m.channel.send(`I was unable to find that specific command.`);
      return this.end(m);
    }
    m.channel.send(
      `*Command Name* - \`${m.prefix}${cmd.name}\`\n` +
      `*Command Aliases* - ${cmd.aliases.map(a => "`" + m.prefix + a + "`").join(", ") || "None"}\n` + // eslint-disable-line prefer-template, max-len
      `*Command Description*\n\`\`\`${cmd.desc}\`\`\``
    );
    return this.end(m);
  }
};