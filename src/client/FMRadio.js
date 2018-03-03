const { Client, Collection } = require('discord.js');

class FMRadio extends Client {
  constructor() {
    super({ disableEveryone: true });
  }
}

module.exports = new FMRadio();

process.on('unhandledRejection', console.log);