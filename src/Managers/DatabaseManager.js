// Imports
const { MongoClient } = require("mongodb");
// Classes
class DefaultServer {
  constructor(gid) {
    this.gid = gid;
    this.music = {
      volume: 100 / 400,
      favorites: [],
      dislikes: [],
      likes: []
    };
    this.permissions = {};
    this.settings = {
      prefix: "default",
      // Stay in VC (Using Detection)
      sivc: false,
      // Auto Reconnect
      ar: true,
      queue: {
        maxPlaylist: 100
      },
      annoucements: {
        enabled: true,
        channel: 0
      }
    };
  }
}
// Constructor
module.exports = class DatabaseManager {
  constructor(client) {
    this.client = client;
    this.mClient = undefined;
    this.db = undefined;
  }
  // Connect
  async connect() {
    const logPre = "[MDB]";
    const mCURL = `mongodb://${
      this.client.config.mongodb.username}:${
      this.client.config.mongodb.password}@${
      this.client.config.mongodb.host}:${
      this.client.config.mongodb.port}/${
      this.client.config.mongodb.database}`;
    console.log(logPre, "Connecting...");
    try {
      this.mClient = await MongoClient.connect(mCURL, null);
      this.db = this.mClient.db("FMRadio");
      console.log(logPre, "Connected.");
      this.register();
      return this.db;
    } catch (e) {
      console.error(logPre, "Error Connecting\n", e);
      process.exit();
    }
  }
  // Registry
  register() {
    this.registerEvents();
  }
  registerEvents() {
    this.db.on("close", me => {
      console.error("The database closed randomly. Restarting!");
      if (me) console.error(`Close: ${me}`);
      process.exit();
    });
    this.db.on("error", me => {
      console.error("There was an uncaught mongo error. Restarting!");
      if (me) console.error(`Error: ${me}`);
      process.exit();
    });
    this.db.on("timeout", me => {
      console.error("The database has timed out. Reconnecting!");
      this.connect();
    });
  }
  // Utilities
  async makeNewGuild(gid, isMissing = false) {
    const gCollection = await this.getCollection(this.client.config.mongodb.collections.guildData);
    if (!gCollection) return false;
    await gCollection.deleteMany({ gid: gid });
    const gData = new DefaultServer(gid);
    await gCollection.insertOne(gData);
    const guild = this.client.guilds.get(gid);
    console.log(!guild ? `I've joined ${gid}.` : `I've ${(isMissing ? "added missing guild" : "joined")} ` +
      `${guild.name} (${guild.id}) owned by ${guild.owner.user.username} (${guild.owner.id}).`);
    return gData;
  }
  // Getters
  async getCollection(name) {
    if (!this.db) return null;
    const col = await this.db.collection(name);
    return col;
  }
  async getGuildData(gid) {
    if (!this.db) return null;
    const gCollection = await this.getCollection(this.client.config.mongodb.collections.guildData);
    const dCollection = await this.getCollection(this.client.config.mongodb.collections.donationData);
    if (!gCollection || !dCollection) return null;
    const gData = await gCollection.findOne({ gid: gid });
    // If (!gData) gData = await this.makeNewGuild(gid, true);
    if (!gData) return null;
    delete gData._id;
    const da = await dCollection.findOne({ guild_id: gid });
    if (!da) { gData.donationAmount = 0; } else {
      delete da._id;
      gData.donationAmount = da.amount;
    }
    return gData;
  }
};