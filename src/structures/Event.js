class Event {
  constructor(client, path, { event }) {
    this.client = client;
    this.event = event;
    this.path = path;
  }
}

module.exports = Event;