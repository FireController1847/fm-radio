exports.IsBeta = true;
exports.Release = {
  prefix: 'P!'
};
exports.Beta = {
  prefix: 'Ps!'
};
exports.Global = {
  colors: {
    default: '#00FF8F'
  },
  maintenance: {
    minor: false,
    major: false,
    message: ''
  },
  mongodb: {
    collections: {
      guildData: 'guilds',
      donationData: 'donations',
      blacklistData: 'blacklist'
    }
  },
  owners: [
    // Fire
    '112732946774962176',
    // FireAlt
    '268884634354450432'
  ]
};