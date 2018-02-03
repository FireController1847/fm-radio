const Command = require("../../Constructors/Command.js");
const _ = require("lodash");
module.exports = class extends Command {
  constructor(client, filePath) {
    super(client, filePath, {
      name: "commands",
      desc: "Returns a list of commands in the bot.",
      aliases: ["cmds", "c"]
    });
  }
  execute(m) {
    this.start(m);
    // Amount Per Page
    const APP = 15;
    const list = this.client.commands.map(c => ({ name: c.name, desc: c.desc }));
    const pages = Math.ceil(list.length / APP);
    if (!m.argsLower[1]) {
      m.args[1] = "1";
      m.argsLower[1] = "1";
    }
    if (list.length <= 0) {
      m.channel.send("There are currently no commands available in the bot.");
      return this.end(m);
    }
    if (m.argsLower[1] == "pages") {
      m.channel.send(`There are ${pages} page${(pages == 1 ? "" : "s")}.`);
      return this.end(m);
    }
    if (isNaN(parseInt(m.argsLower[1]))) {
      m.channel.send("Please use a valid number to specify the page.");
      return this.end(m);
    }
    const page = parseInt(m.argsLower[1]);
    if (page <= 0 || (page * APP) - APP >= list.length) {
      m.channel.send("Please use a valid page.");
      return this.end(m);
    }
    let results = [];
    for (let i = (page * APP) - APP; i < page * APP; i++) {
      if (list[i]) {
        list[i].pos = i;
        results.push(list[i]);
      }
    }
    results = _.sortBy(results, r => r.name);
    m.channel.send(
      `Quick Command List Generator (v1) (Page ${page}/${pages})\n\n` +
      `${results.map(c => `\`${m.prefix}${c.name}\` / ${c.desc}`).join("\n")}` +
      `\n\nRun \`${m.prefix}commands <page #>\` to view other pages.`
    );
    return this.end(m);
  }
};