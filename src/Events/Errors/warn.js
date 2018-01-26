const Event = require("../../Constructors/Event.js");

module.exports = class extends Event {
  constructor(client, filePath) {
    super(client, filePath, {name: "warn"});
  }
  execute(bw) {
    console.log(`[Bot Warning] ${bw}`);
  }
};