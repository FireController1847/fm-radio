const { MongoClient } = require('mongodb');
const DefServer = require('../constructors/DefServer.js');

module.exports = class DBHandler {
  constructor(c) {
    this.client = c;
    this.db = null;
  }
  async connect() {
    const mCURL = 'mongodb://'
    + this.client.config.mongodb.username + ':'
    + this.client.config.mongodb.password + '@'
    + this.client.config.mongodb.host + ':'
    + this.client.config.mongodb.port + '/'
    + this.client.config.mongodb.database;
    console.log(`[MDB] Connecting...`);
    try {
      const client = new MongoClient();
      console.log(client.connect);
      // const db = await (new MongoClient()).connect(mCURL);
      // console.log(`[MDB] Connected.`);
      // this.db = db;
      // this.setupErrorHandlers();
      // return db;
    } catch(e) {
      console.error(`[MDB] Error Connecting.\n`, e);
      process.exit();
    }
  }
  setupErrorHandlers() {
    this.db.on('close', me => {
      console.error(`The database closed randomly. Restarting!`);
      if (me) console.error(`Close: ` + me);
      process.exit();
    });
    this.db.on('error', me => {
      console.error(`There was an uncaught mongo error. Restarting!`);
      if (me) console.error(`Error: ` + me);
      process.exit();
    });
    this.db.on('reconnect', () => {
      console.error(`The database reconnected, but may have caused multiple event emitters. Restarting!`);
      process.exit();
    });
    this.db.on('timeout', me => {
      console.error(`The database has timed out. Restarting!`);
      if (me) console.error(`Timeout: ` + me);
      process.exit();
    });
  }
};