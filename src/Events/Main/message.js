const Event = require("../../Constructors/Event.js");

module.exports = class extends Event {
  constructor(client, filePath) {
    super(client, filePath, { name: "message" });
  }
  async execute(m) {
    if (m.guild && !m.guild.available || m.author.bot) return;
    m.isDM = m.guild ? false : true;
    if (!m.isDM) {
      try {
        m.guildData = await this.client.databaseManager.getGuildData(m.guild.id);
      } catch (e) {
        m.guildData = null;
      }
    }
    m.prefix = !m.server || m.server.settings.prefix == "default" ?
      this.client.config.beta ? this.client.config.bPrefix : this.client.config.prefix : m.server.settings.prefix;
    const mreg = new RegExp(`^<@!?${this.client.user.id}>`);
    if (mreg.test(m.content)) {
      m.content = m.prefix + m.content.replace(mreg, "").replace(" ", "");
      m.mentions.users = m.mentions.users.filter(u => u.id != this.client.user.id);
      if (m.content.toLowerCase().includes("what") && m.content.toLowerCase().includes("prefix")) {
        m.content = `${m.prefix}prefix`;
      }
    }
    if (!m.content.startsWith(m.prefix)) return;
    m.isOwner = this.client.config.owners.includes(m.author.id);
    m.args = m.content.split(" ");
    m.argsLower = m.content.toLowerCase().split(" ");
    m.command = m.argsLower[0].substring(m.prefix.length, m.argsLower[0].length);
    /* eslint-disable max-len */
    m.errors = {
      noDMSupport: function noDMSupport() { return m.channel.send(":warning: This command does not support Direct Messages."); },
      notBotOwner: function notBotOwner() { return m.channel.send(":no_entry_sign: You're not a bot owner. You do not have permission to use this command."); },
      cantEmbedLinks: function cantEmbedLinks() { return m.channel.send(":link: This command won't run because the following permissions are missing: `Embed Links`"); },
      databaseUnavailable: function databaseUnavailable() { return m.channel.send(":satellite: This command has failed to run as the database is currently unavailable. Please have some patience and allow the database to reconnect."); },
      userBlacklisted: function userBlacklisted() { return m.channel.send(":page_facing_up: You have been blacklisted from this bot. You do not have permission to use commands."); },
      internalError: function internalError(e, msg) { return m.channel.send(`:boom: There was an internal error. ${msg ? msg : "Please "}report this to a bot developer.\`\`\`js\n${e.stack}\n\`\`\``); }
    };
    /* eslint-enable max-len */
    m.ep = true;
    if (!m.isDm) {
      try {
        m.ep = m.channel.permissionsFor(m.guild.me).has("EMBED_LINKS");
      } catch (e) {
        m.ep = false;
      }
      try {
        if (!m.channel.permissionsFor(m.guild.me).has("SEND_MESSAGES")) {
          return m.author.send(`The bot does not have permission to send messages in <#${m.channel.id}>.`);
        }
      } catch (e) {
        return;
      }
    }
    try {
      const blacklist = await this.databaseManager.getCollection(this.client.config.mongodb.collections.blacklistData);
      if (!blacklist) throw new Error("Ignore");
      if (await blacklist.findOne({ id: m.author.id })) return m.errors.userBlacklisted();
      if (!m.isDM && await blacklist.findOne({ id: m.guild.id })) {
        m.guild.owner.send(`:crossed_swords: Your guild ${m.guild.name} has been blacklisted from this bot.`);
        m.guild.leave();
        return (await this.databaseManager.getCollection(this.client.config.mongodb.collections.guildData))
          .deleteMany({ guild_id: m.guild.id });
      }
    } catch (e) {
      // ...
    }
    const cmd = await this.client.getCommand(m.command);
    if (!cmd) return;
    if (!m.isDM) {
      console.log(`User ${m.author.username} (${m.author.id}) issued server command ` +
        `${m.prefix}${m.command} in ${m.guild.name} (${m.guild.id}), #${m.channel.name}.`);
    } else {
      console.log(`User ${m.author.username} (${m.author.id}) issued private command ${m.prefix}${m.command} in DM's.`);
    }
    return cmd.execute(m);
  }
};