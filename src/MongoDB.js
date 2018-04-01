const { MongoClient } = require('mongodb');
const { mongo } = require('./Data/Tokens.js');
const _ = require('lodash');

class DefaultServer {
  constructor(gid) {
    this.gid = gid;
    this.music = {
      volume: 85 / 400,
      // Loop the Current Video
      loop: false,
      // Favorite Stations
      favorites: [],
      // Custom Stations
      custom: {},
      // Current Station / Song
      current: {
        song: {},
        station: {}
      }
    };
    this.permissions = {};
    this.settings = {
      prefix: 'default',
      // Announce Messages
      messages: {
        enabled: true,
        channel: 0,
        // Auto Delete
        delete: {
          enabled: false,
          time: 0
        }
      },
      // Stay In Voice Channel
      sivc: false
    };
  }
}

class MongoDB {
  constructor(bot) {
    this.bot = bot;
    this.client = null;
    this.collections = {};
    this.db = null;
    // Kept here for testing purposes.
    this.DefaultServer = DefaultServer;
    this.connect();
  }
  // Logging
  debug() {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(`[Database]`);
    this.bot.debug.apply(this.bot, args);
  }
  error() {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(`[Database]`);
    this.bot.debug.apply(this.bot, args);
  }
  // Connection
  async connect() {
    this.debug('Database connecting...');
    try {
      this.client = await MongoClient.connect(this.build(), null);
    } catch (e) {
      return this.error(e);
    }
    this.debug('Database connected.');
    this.db = this.client.db(mongo.database);
    this.debug(`Database ${mongo.database} selected.`);

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

    return this.db;
  }
  build() {
    return `mongodb://${
      mongo.username}:${
      mongo.password}@${
      mongo.host}:${
      mongo.port}/${
      mongo.database}`;
  }
  // Utilities
  get guilds() {
    if (!this.collections.guilds || Date.now() - this.collections.guilds.age >= 900000) {
      this.collections.guilds = {
        col: this.db.collection(mongo.collections.guilds),
        age: Date.now()
      };
    }
    return this.collections.guilds.col;
  }
  get donations() {
    if (!this.collections.donations || Date.now() - this.collections.donations.age >= 900000) {
      this.collections.donations = {
        col: this.db.collection(mongo.collections.donations),
        age: Date.now()
      };
    }
    return this.collections.donations.col;
  }
  async verifyDataIntegrity(gid, data) {
    const newData = _.merge(JSON.parse(JSON.stringify(new DefaultServer(gid))), data);
    if (_.isEqual(data, newData)) {
      return data;
    } else {
      this.debug('failed to verify');
      await this.guilds.update({ gid }, newData);
      return newData;
    }
  }
  async createGuild(gid, isMissing = false) {
    if (!this.db) throw new Error('Database Not Ready');
    const guild = this.bot.guilds.get(gid);
    if (!guild) throw new Error('Cannot Find Guild');
    if (!this.guilds) await this.db.createCollection(mongo.collections.guilds);
    await this.guilds.deleteMany({ gid });
    const data = new DefaultServer(gid);
    await this.guilds.insertOne(data);
    this.debug(!guild ? `I've joined ${gid}.` : `I've ${(isMissing ? 'added missing guild' : 'joined')} ` +
    `${guild.name} (${guild.id}) owned by ${guild.owner.user.username} (${guild.owner.id}).`);
    return data;
  }
  async fetchGuild(gid) {
    if (!this.db) throw new Error('Database Not Ready');
    let data = await this.guilds.findOne({ gid });
    if (!data) data = await this.createGuild(gid, true);
    delete data._id;
    data = await this.verifyDataIntegrity(gid, data);
    const da = await this.donations.findOne({ guild_id: gid });
    if (!da) {
      data.da = 0;
    } else {
      data.da = da.amount;
    }
    return data;
  }
}

module.exports = MongoDB;