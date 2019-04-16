export class EventDispatcher {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        let handlers = this.events[event] || [];
        handlers.push(callback);
        this.events[event] = handlers;
    }

    trigger(event, data) {
        let handlers = this.events[event];
        if (!handlers || handlers.length < 1)
            return;

        [].forEach.call(handlers, handler => {
            handler(data);
        });
    }
}
