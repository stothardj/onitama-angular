interface ListenerData {
  callback: Function;
  eventTypes: string[];
}

export class EventTarget {
  private listeners: ListenerData[];

  constructor() {
    this.listeners = [];
  }

  listen(callback: Function, ...eventTypes: string[]) {
    this.listeners.push({ callback, eventTypes });
  }

  dispatch(eventType: string, data = null) {
    for (const listener of this.listeners) {
      if (listener.eventTypes.includes(eventType)) {
        listener.callback(eventType, data);
      }
    }
  }
}
