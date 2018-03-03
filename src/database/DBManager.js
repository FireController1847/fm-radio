const { MongoClient } = require('mongodb');
const mongo = require('../mongo.key');

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
      prefix: 'default',
      // Stay in VC (Using Detection) @ https://trello.com/c/xlecXtQs/
      sivc: false,
      // Limit to VC(s) @ https://trello.com/c/lFWQGBWr/
      ltvc: [],
      // Auto Reconnect @ https://trello.com/c/JRwkWdaY/
      ar: true,
      queue: {
        maxPlaylist: 100
      },
      announcements: {
        enabled: true,
        channel: 0
      }
    };
  }
}

class DBManager {
  constructor(client) {
    this.client = client;
    this.url = `mongodb://${
      mongo.username}:${
      mongo.password}@${
      mongo.host}:${
      mongo.port}/${
      mongo.database}`;
    this.mclient = null;
    this.db = null;
  }
  // Debug
  debug(...args) {
    return this.client.debug(`[DB]`, ...args);
  }
  error(...args) {
    return this.client.error(`[DB]`, ...args);
  }
  // Connect
  async connect() {
    this.debug('Creating Database...');
    this.mclient = await MongoClient.connect(this.url, null);
    this.db = this.mclient.db(mongo.database);

    this.db.on('close', mongoError => {
      this.error('Database Randomly Closed');
      if (mongoError) this.error(`Error: ${mongoError.stack}`);
    });
    this.db.on('error', mongoError => {
      this.error('Database Internal Error');
      if (mongoError) this.error(`Error: ${mongoError.stack}`);
    });
    this.db.on('reconnect', mongoError => {
      this.debug('Database Reconnected');
      if (mongoError) this.error(`Error: ${mongoError.stack}`);
    });
    this.db.on('timeout', mongoError => {
      this.error('Database Timeout');
      if (mongoError) this.error(`Error: ${mongoError.stack}`);
    });

    this.debug('Database Created.');
    return this.db;
  }
  // Utilities
  async makeNewGuild(gid, isMissing = false) {
    if (!this.db) throw new Error('Database Not Ready');
    const guild = this.client.guilds.get(gid);
    if (!guild) throw new Error('Client Cannot Find Guild');
    const gCollection = this.db.collection(this.client.config.mongodb.collections.guildData);
    if (!gCollection) throw new Error('Guild Database Missing');
    await gCollection.deleteMany({ gid });
    const gData = new DefaultServer(gid);
    await gCollection.insertOne(gData);
    console.log(!guild ? `I've joined ${gid}.` : `I've ${(isMissing ? 'added missing guild' : 'joined')} ` +
      `${guild.name} (${guild.id}) owned by ${guild.owner.user.username} (${guild.owner.id}).`);
    return gData;
  }
  async fetchGuildData(gid) {
    if (!this.db) throw new Error('Database Not Ready');
    const gCollection = await this.getCollection(this.client.config.mongodb.collections.guildData);
    const dCollection = await this.getCollection(this.client.config.mongodb.collections.donationData);
    if (!gCollection || !dCollection) throw new Error('Guild or Donations Collection Missing');
    let gData = await gCollection.findOne({ gid: gid });
    if (!this.client.config.IsBeta && !gData) gData = await this.makeNewGuild(gid, true);
    if (!gData) return null;
    delete gData._id;
    const da = await dCollection.findOne({ guild_id: gid });
    if (!da) { gData.donationAmount = 0; } else {
      delete da._id;
      gData.donationAmount = da.amount;
    }
    return gData;
  }
}

exports.DBManager = DBManager;