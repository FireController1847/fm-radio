const Event = require("../../Constructors/Event.js");

module.exports = class extends Event {
  constructor(client, filePath) {
    super(client, filePath, { name: "error" });
  }
  execute(be) {
    console.log(`[Bot Error] ${be}`);
  }
};