// Imports
const { Client, Collection } = require("discord.js");
// Modules
const snekfetch = require("snekfetch");
const request = require("request");
const klaw = require("klaw");
const path = require("path");
// PathList
const pCommands = path.join(__dirname, "Commands");
const pEvents = path.join(__dirname, "Events");
// Client
module.exports = new class FMRadio extends Client {
  constructor() {
    super({ disableEveryone: true });
    this.config = require("./Config.js");
    this.colors = {
      default: "#00FF8F"
    };
    this.setup();
    console.log("Connecting...");
    this.login(this.config.tokens.main);
  }
  // Setup
  setup() {
    this.setupLogger();
    this.setupGames();
    this.setupCollections();
    this.setupDatabase();
    this.register();
  }
  setupGames() {
    if (this.status != 0) {
      this.gameLoop = setTimeout(() => {
        this.setupGames();
      }, 1500);
      return;
    }
    if (this.config.maintenance.major) return this.user.setActivity("Under Maintenance");
    const gList = [
      "YouTube ▶",
      "IHeartRadio ❤",
      "Queue 🔨",
      "Music 🎶",
      "Pausing ⏸",
      "❓ P!help",
      "Version 7 🎉",
      "Looping ➰",
      "Customizing 💇"
    ];
    this.user.setActivity(gList[Math.floor(Math.random() * gList.length)]);
    this.gameLoop = setTimeout(() => {
      this.setupGames();
    }, 300000);
  }
  setupLogger() {
    const client = this;
    const ocl = console.log;
    console.log = function log() {
      const args = [];
      args.push(`[Shard ${client.shard.id}]`);
      for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      ocl.apply(console, args);
    };
    const oce = console.error;
    console.error = function logerr() {
      const args = [];
      args.push(`[Shard ${client.shard.id}]`);
      for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      oce.apply(console, args);
    };
  }
  setupCollections() {
    this.commands = new Collection();
    this.events = new Collection();
  }
  setupDatabase() {
    this.databaseManager = new (require("./Managers/DatabaseManager.js"))(this);
    this.databaseManager.connect();
  }
  // Registry
  register() {
    this.registerCommands();
    this.registerEvents();
  }
  registerCommands() {
    klaw(pCommands).on("data", file => {
      file = path.parse(file.path);
      if (!file.ext || file.ext != ".js") return;
      const fName = `${file.dir}/${file.base}`;
      if (require.cache[require.resolve(fName)]) delete require.cache[require.resolve(fName)];
      const cmd = new (require(fName))(this);
      this.commands.set(cmd.name, cmd);
    });
  }
  registerEvents() {
    klaw(pEvents).on("data", file => {
      file = path.parse(file.path);
      if (!file.ext || file.ext != ".js") return;
      const evt = new (require(`${file.dir}/${file.base}`))(this);
      this.events.set(evt.name, evt);
      this.on(evt.name, (...args) => {
        this.events.get(evt.name).execute(...args);
      });
    });
  }
  // Utilities
  async utilUpdateWeb(updateAll) {
    const logPre = "[WU]";
    // Discord.pw - disallows snekfetch
    request("https://bots.discord.pw/api/bots/255933783293820928/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": this.config.tokens.websites.discordpw },
      json: { server_count: this.guilds.size, shard_id: this.shard.id, shard_count: this.shard.count }
    }, e => {
      if (e) return console.warn(logPre, "Unable to update discord.pw\n", e.body);
      console.log(logPre, "Successfully updated discord.pw");
    });
    // Discordbots.org
    snekfetch.post("https://discordbots.org/api/bots/255933783293820928/stats")
      .set("Content-Type", "application/json")
      .set("Authorization", this.config.tokens.websites.discordbots)
      .send({ server_count: this.guilds.size, shard_id: this.shard.id, shard_count: this.shard.count })
      .then(() => {
        console.log(logPre, "Successfully updated discordbots.org");
      }).catch(e => {
        console.warn(logPre, "Unable to update discordbots.org\n", e.body);
      });
    if (!updateAll) return;
    const sAvailable = await this.getAllShardsAvailable();
    if (!sAvailable) return console.warn("Unable to update all websites as a shard is unavailable.");
    let gCount;
    try {
      gCount = await this.shard.fetchClientValues("guilds.size");
    } catch (e) {
      return console.warn(logPre, "Unable to fetch all guilds.");
    }
    gCount = gCount.reduce((a, b) => a + b, 0);
    // Carbonitex.net
    snekfetch.post("https://www.carbonitex.net/discord/data/botdata.php")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({ key: this.config.tokens.websites.carbon, servercount: gCount }).then(() => {
        console.log(logPre, "Successfully updated carbonitex.net");
      }).catch(e => {
        console.warn(logPre, "Unable to update carbonitex.net\n", e.body);
      });
    // Discordlist.net
    snekfetch.post("https://bots.discordlist.net/api")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send({ token: this.config.tokens.websites.discordlist, servers: gCount }).then(() => {
        console.log(logPre, "Successfully updated discordlist.net");
      }).catch(e => {
        console.warn(logPre, "Unable to update discordlist.net\n", e.body);
      });
  }
  // Getters
  async getAllShardsAvailable() {
    try {
      await this.shard.fetchClientValues("ping");
    } catch (e) {
      return false;
    }
    return true;
  }
  async getAndReduce(clientValue) {
    const vCount = await this.shard.fetchClientValues(clientValue);
    return vCount.reduce((a, b) => a + b, 0);
  }
  getCommand(name) {
    if (this.commands.has(name)) return this.commands.get(name);
    this.commands.forEach(c => { if (c.aliases && c.aliases.includes(name)) return c; });
    return null;
  }
  getAllArguments(args, text) {
    return text.substring(args.map(a => a.length + 1).reduce((a, b) => a + b, 0), text.length);
  }
};
process.on("unhandledRejection", console.trace);