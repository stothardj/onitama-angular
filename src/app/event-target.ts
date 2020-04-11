interface ListenerData {
  callback: Function;
  eventTypes: string[];
}

export class EventTarget {
  private listeners: ListenerData[];

  constructor() {
    this.listeners = [];
  }

  listen(callback: Function, ...eventTypes: string[]): void {
    this.listeners.push({ callback, eventTypes });
  }

  dispatch(eventType: string, data = null): void {
    for (const listener of this.listeners) {
      if (listener.eventTypes.includes(eventType)) {
        listener.callback(eventType, data);
      }
    }
  }
}
