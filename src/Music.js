class Music {
  constructor(client) {
    this.client = client;
    this.listeners = new Map();
  }
  // Logging
  debug() {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(`[Music]`);
    this.bot.debug.apply(this.bot, args);
  }
  error() {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(`[Music]`);
    this.error.debug.apply(this.bot, args);
  }
  // VC Handling
  async connect(m, vc = m.member.voiceChannel) {
    if (!vc) throw new Error('notConnected');
    const c = this.client.voiceConnections.get(m.guild.id);
    if (c) return c;
    if (!vc.joinable) throw new Error('noPermission');
    // eslint-disable-next-line no-return-await
    return await vc.join();
  }
  leave(gid) {
    const c = this.client.voiceConnections.get(gid);
    if (c) c.disconnect();
  }
}

module.exports = Music;