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

    has(key) {
        let items = this.items;
        return key.split(".").every(x => {
            if (typeof items != "object" || items === null || ! x in items) {
                return false;
            }
            items = items[x];
            return true;
        });
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