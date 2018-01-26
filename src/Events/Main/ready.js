const Event = require("../../Constructors/Event.js");

module.exports = class extends Event {
  constructor(client, filePath) {
    super(client, filePath, {name: "ready"});
  }
  async execute() {
    console.log(`Online and ready! Currently on ${this.client.guilds.size} guild${(this.client.guilds.size == 1 ? '' : 's')}.`);
    this.client.user.setStatus("online");
    this.client.utilUpdateWeb((
      await this.client.getAllShardsAvailable() &&
      this.client.shard.id == this.client.shard.count - 1
    ));
  }
};