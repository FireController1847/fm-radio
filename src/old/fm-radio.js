// Imports
const { MongoClient } = require("mongodb");
const { Client, Collection } = require("discord.js");
// Modules
const snekfetch = require("snekfetch");
const discord = require("discord.js");
const klaw = require("klaw");
const path = require("path");
const ce = require("embed-creator");
// Paths
const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');
// FM Radio
new class FMRadio extends Client {
  constructor() {
    super({"disableEveryone": true});
    this.config = require("./config.js");
    this.initiate().then(() => {
      this.login(this.config.tokens.main);
    });
  }
  async initiate() {
    this.addPrefixToLogging();
    this.dbHandler = new (require("./handlers/db.js"))(this);
    await this.dbHandler.connect();
    this.launchTime = new Date();
    this.commands = new Collection();
    this.registerCommands();
    this.registerEvents();
  }
  addPrefixToLogging() {
    const client = this;
    const ocl = console.log;
    console.log = function() {
      const args = [];
      args.push(`[Shard ${client.shard.id}]`);
      for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      ocl.apply(console, args);
    };
    const oce = console.error;
    console.error = function() {
      const args = [];
      args.push(`[Shard ${client.shard.id}]`);
      for (let i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      oce.apply(console, args);
    };
  }
  registerCommands() {
    klaw(commandsPath).on('data', item => {
      const file = path.parse(item.path);
      if (!file.ext || file.ext != '.js') return;
      const fileName = `${file.dir}/${file.base}`;
      if (require.cache[require.resolve(fileName)]) delete require.cache[require.resolve(fileName)];
      const command = new (require(fileName))(this);
      this.commands.set(command.name, command);
    });
  }
  registerEvents() {
    klaw(eventsPath).on("data", item => {
      const file = path.parse(item.path);
      if (!file.ext || file.ext !== ".js") return;
      const event = new (require(`${file.dir}/${file.base}`))(this);
      this.on(event.name, () => { return event.execute(); });
    });
  }
};
// Rejection Handler
process.on('unhandledRejection', console.error);