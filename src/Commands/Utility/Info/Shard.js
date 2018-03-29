const ce = require('embed-creator');
const { Command } = require('discord-akairo');
const pms = require('pretty-ms');

class ShardInfo extends Command {
  constructor() {
    super('shardinfo', {
      description: 'Gives information about the shard that the message\'s guild is on.',
      typing: true
    });
  }
  exec(m) {
    if (!this.client.shard) return m.channel.send('This version of FM Radio is currently not sharded, so this option is unavailable.');
    return m.channel.send(ce(
      this.client.akairoOptions.colors.orange, null, 'Shard Information',
      'Here\'s some information about the part of me that\'s on your server!',
      [
        { inline: true, name: ':1234: Total Shards', value: this.client.shard.count },
        { inline: true, name: ':hash: Shard ID', value: this.client.shard.id },
        { inline: true, name: ':minidisc: Shard Guilds', value: this.client.guilds.size },
        { inline: true, name: ':speech_balloon: Shard Channels', value: this.client.channels.size },
        { inline: true, name: ':person_with_blond_hair: Shard Users', value: this.client.users.size },
        { inline: true, name: ':globe_with_meridians: Shard Voice Connections', value: this.client.voiceConnections.size },
        { inline: true, name: ':clock: Shard Uptime', value: pms(this.client.uptime, { verbose: true, secDecimalDigits: 0 }) }
      ]
    ));
  }
}

module.exports = ShardInfo;