module.exports = class DefServer {
  constructor(guild) {
    this.id = guild.id;
    this.music = {
      "volume": 10/100
    };
    this.settings = {
      "prefix": "default"
    };
  }
};