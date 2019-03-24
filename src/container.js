export class DataContainer {
    constructor() {
        this.items = {};
    }

    add(key, item) {
        this.items[key] = item;
    }

    get(key) {
        return key.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null
        }, this.items || self);
    }
}

export class CallbackContainer {
    constructor() {
        this.items = {};
    }

    add(key, item) {
        this.items[key] = item;
    }

    get(key) {
        return this.items[key] || null;
    }

    has(key) {
        return this.items.hasOwnProperty(key);
    }
}