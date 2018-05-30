/**
 * Copyright (c) 2018, Visual Fire Development  All Rights Reserved
 * Copyrights licensed under the GNU General Public License v3.0.
 * See the accompanying LICENSE file for terms.
 */

const { MongoClient } = require('mongodb');
// const { mongo } = require('./Data/Tokens.js');
const _ = require('lodash');

class DefaultServer {
  constructor(guild_id) {
    this.guild_id = guild_id;
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
      normalize: 'ALL',
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
  }
}

class MongoDB {
  constructor(client) {
    this.bot = client;
    this.client = null;
    this.collections = {};
    this.db = null;
    this.DefaultServer = DefaultServer;
    this.connect();
  }
  async connect() {
    console.log()
  }
}