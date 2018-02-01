module.exports = class Event {
  constructor(client, filePath, { name }) {
    this.client = client;
    this.path = filePath;
    this.name = name;
  }
};