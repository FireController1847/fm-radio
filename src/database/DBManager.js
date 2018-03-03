const { MongoClient } = require('mongodb');
const { mongo } = require('../util/Tokens.js');

class DefaultServer {
  constructor(gid) {
    this.guild_id = gid;
    this.music = {
      volume: 85 / 400,
      skipsLeft: 10,
      pauseAllowed: true,
      family_friendly: false,
      dislikes: [],
      likes: [],
      queue: [],
      current: ''
    };
    this.permissions = {
      like: 'ALL',
      dislike: 'ALL',
      normalie: 'ALL',
      move: 'DJ',
      skip: 'DJ',
      volume: 'ALL',
      play: 'ALL',
      stop: 'ALL',
      queue_insert: 'ALL',
      queue_insertpl: 'DJ',
      queue_wipe: 'DJ',
      queue_remove: 'ALL',
      queue_shuffle: 'ALL',
      queue_playlist_max: 100
    };
    this.settings = {
      prefix: 'default',
      announce_enabled: true,
      announce_channel: 0
    };
    this.profile = {};
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
    this.skipResetter = setInterval(async () => {
      if (this.client.shard.id != this.client.shard.count - 1) return;
      if ((new Date()).getMinutes() == 0) {
        let guildData;
        try {
          guildData = this.collection(this.client.config.mdb.guilds);
        } catch (e) {
          return this.error('Unable To Fetch Servers', e);
        }
        guildData.updateMany({
          $or: [{
            'music.skipsLeft': { $lt: 5 }
          }, {
            'music.pauseAllowed': false
          }]
        }, {
          $set: {
            'music.skipsLeft': 5,
            'music.pauseAllowed': true
          }
        }).then(() => {
          this.debug('Skips Reset');
        }).catch(e => {
          this.error('Error Restting Skips', e);
        });
      }
    }, 60000);
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
    try {
      this.mclient = await MongoClient.connect(this.url, null);
    } catch (e) {
      return this.error(e);
    }
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
    const gCollection = this.db.collection(this.client.config.mdb.guilds);
    if (!gCollection) throw new Error('Guild Database Missing');
    await gCollection.deleteMany({ guild_id: gid });
    const gData = new DefaultServer(gid);
    await gCollection.insertOne(gData);
    this.debug(!guild ? `I've joined ${gid}.` : `I've ${(isMissing ? 'added missing guild' : 'joined')} ` +
      `${guild.name} (${guild.id}) owned by ${guild.owner.user.username} (${guild.owner.id}).`);
    return gData;
  }
  async fetchGuildData(gid) {
    if (!this.db) throw new Error('Database Not Ready');
    const gCollection = await this.getCollection(this.client.config.mdb.guilds);
    const dCollection = await this.getCollection(this.client.config.mdb.donations);
    if (!gCollection || !dCollection) throw new Error('Guild or Donations Collection Missing');
    let gData = await gCollection.findOne({ guild_id: gid });
    if (!gData) gData = await this.makeNewGuild(gid, true);
    if (!gData) return null;
    delete gData._id;
    const da = await dCollection.findOne({ guild_id: gid });
    if (!da) { gData.donationAmount = 0; } else {
      delete da._id;
      gData.donationAmount = da.amount;
    }
    return gData;
  }
  collection(name) {
    return this.db.collection(name);
  }
}

module.exports.DBManager = DBManager;