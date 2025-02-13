const PubSub = {
  events: {},
  subscribe: function (eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  },

  publish: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => {
        callback(data);
      });
    }
  },
};

function waitForEvent(eventName) {
  return new Promise((resolve) => {
    const handler = (data) => {
      resolve(data); // Resolve the promise with the event data
    };

    PubSub.subscribe(eventName, handler);
  });
}

export { PubSub, waitForEvent };
