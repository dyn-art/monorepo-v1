export class Watcher<GWatchedObj> {
  private callbacks: {
    [K in keyof GWatchedObj]?: Array<(value: GWatchedObj[K]) => void>;
  } = {};

  constructor() {
    // do nothing
  }

  watch<K extends keyof GWatchedObj>(
    property: K,
    callback: (value: GWatchedObj[K]) => void
  ) {
    if (!Array.isArray(this.callbacks[property])) {
      this.callbacks[property] = [];
    }
    this.callbacks[property]?.push(callback);
  }

  notify<K extends keyof GWatchedObj>(property: K, value: GWatchedObj[K]) {
    const callbackList = this.callbacks[property];
    if (Array.isArray(callbackList)) {
      for (const callback of callbackList) {
        callback(value);
      }
    }
  }
}
