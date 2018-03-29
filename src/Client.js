const { AkairoClient } = require('discord-akairo');
const MongoDB = require('./MongoDB.js');
const path = require('path');
const { token } = require('./Data/Tokens.js');

const client = new AkairoClient({
  ownerID: '112732946774962176',
  prefix: 'fm$',
  allowMention: true,
  emitters: { process },
  commandDirectory: path.join(__dirname, 'Commands'),
  inhibitorDirectory: path.join(__dirname, 'Inhibitors'),
  listenerDirectory: path.join(__dirname, 'Listeners'),
  // Custom Options
  colors: {
    green: '#00FF8F'
  }
}, {
  disableEveryone: true,
  shardId: 6,
  shardCount: 20
});

client.mongo = new MongoDB(client);

client.login(token);