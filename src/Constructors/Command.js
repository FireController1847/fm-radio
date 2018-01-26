module.exports = class Command {
  constructor(client, filePath, {name, aliases}) {
    this.client = client;
    this.path = filePath;
    this.name = name;
    this.aliases = aliases || new Array();
  }
};