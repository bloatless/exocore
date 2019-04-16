
/**
 * Original version of this library found at: https://github.com/tannerntannern/micro-observer
 */

export let Observer = (function() {

    let _eventDispatcher = null;


    function getPath(path, prop) {
        if (path.length !== 0) {
            return `${path}.${prop}`;
        } else {
            return prop;
        }
    }

    function _create(target, path) {
        let proxies = {};

        let proxyHandler = {
            get: function get(target, prop) {
                if (prop === '__target') {
                    return target;
                }
                if (prop === '__isProxy') {
                    return true;
                }

                let value = target[prop];

                // Functions
                if (typeof value === 'function') {
                    return function(...args) {
                        return value.apply(this.__isProxy ? this.__target : this, args);
                    };
                }

                // Objects
                else if (typeof value === 'object' && value !== null && target.hasOwnProperty(prop)) {
                    // Return existing proxy if we have one, otherwise create a new one
                    let existingProxy = proxies[prop];
                    if (existingProxy && existingProxy.__target === value) {
                        return existingProxy;
                    } else {
                        let proxy = _create(value, getPath(path, prop));
                        proxies[prop] = proxy;
                        return proxy;
                    }
                }

                // All else
                else {
                    return value;
                }
            },

            set: function set(target, prop, value) {
                // fire the dataStoreChange event so bindings can be updated
                _eventDispatcher.trigger('dataStoreChange', {
                    propPath: getPath(path, prop),
                    propValue: value
                });
                target[prop] = value;
                return true;
            },

            deleteProperty: function deleteProperty(target, prop) {
                delete target[prop];
                return true;
            }
        };

        return new Proxy(target, proxyHandler);
    }

    return {
        setEventDispatcher(eventDispatcher) {
            _eventDispatcher = eventDispatcher;
        },

        create: function create(target) {
            return _create(target, '');
        }
    };
})();
