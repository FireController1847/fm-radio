const Event = require("../../Constructors/Event.js");

module.exports = class extends Event {
  constructor(client, filePath) {
    super(client, filePath, {name: "disconnect"});
  }
  execute(ce) {
    console.log(`Disconnected from Discord, restarting... (Code ${ce.code}, Reason: ${ce.reason})`);
    process.exit();
  }
};