const { Client, Collection } = require('discord.js');
const DBManager = require('./database/DBManager.js');
const config = require('./config.js');
const moment = require('moment-timezone');

class FMRadio extends Client {
  constructor() {
    super({ disableEveryone: true });

    this.config = Object.assign({},
      config.IsBeta ? config.Beta : config.Release,
      config.Global,
      { IsBeta: config.IsBeta }
    );

    this.commands = new Collection();
    this.events = new Collection();
    this.dbm = new DBManager();

    this.dbm.connect();
    this.debug(`Logging in...`);
    this.login(require('./tokens.key').bot);
  }
  debug(...args) {
    console.log(`[${moment().format(`HH:MM:SS`)}]`, `[Shard ${this.shard.id}]`, ...args);
  }
  error(...args) {
    console.error(`[${moment().format(`HH:MM:SS`)}]`, `[Shard ${this.shard.id}]`, ...args);
  }
  gameloop() {
    if (this.status != 0) {
      this.gameloopint = setTimeout(() => {
        this.gameloop();
      }, 1500);
    }
    if (this.config.maintenance.major) return this.user.setActivity('Under Maintenance');
    const gList = [
      'YouTube ▶',
      'IHeartRadio ❤',
      'Queue 🔨',
      'Music 🎶',
      'Pausing ⏸',
      '❓ P!help',
      'Version 7 🎉',
      'Looping ➰',
      'Customizing 💇'
    ];
    this.user.setActivity(gList[Math.floor(Math.random() * gList.length)]);
    this.gameloopint = setTimeout(() => {
      this.gameloop();
    }, 300000 );
  }
}

module.exports = new FMRadio();