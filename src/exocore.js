
const Binding = function (obj, prop) {
    let _this = this;
    this.currentValue = obj[prop] || null;
    this.elementBindings = [];

    this.valueGetter = () => {
        return _this.currentValue;
    };

    this.valueSetter = value => {
        _this.currentValue = value;
        for (let binding of _this.elementBindings) {
            binding.element[binding.attribute] = value;
        }
    };

    this.addElementBinding = (el, attr, event = null) => {
        let binding = {
            element: el,
            attribute: attr,
            event: null
        };
        if (event !== null) {
            el.addEventListener(event, event => {
                _this.valueSetter(el[attr]);
            });
            binding.event = event;
        }
        this.elementBindings.push(binding);
        el[attr] = _this.currentValue;

        return _this;
    };

    Object.defineProperty(obj, prop, {
        get: this.valueGetter,
        set: this.valueSetter
    });
};

class Exocore {
    constructor() {
        this.knownData = {};
        this.knownCallbacks = {};
        this.bindings = {};
    }

    introduce(name, object) {
        if (typeof object === 'function') {
            this.knownCallbacks[name] = object;
        } else {
            this.knownData[name] = object;
        }
    }

    bind(domElement, propertyPath, attribute, event = null) {
        let [objectName, propertyName] = propertyPath.split('.');
        if (!this.bindings[propertyPath]) {
            this.bindings[propertyPath] = new Binding(this.knownData[objectName], propertyName);
        }

        this.bindings[propertyPath].addElementBinding(domElement, attribute, event);
    }

    init(elRoot = document) {
        // Handle default bindings
        let elements = elRoot.querySelectorAll('[data-ex-bind');
        for (let element of elements) {
            let [attr, propertyPath] = element.getAttribute('data-ex-bind').split(':');
            let event = null;
            switch (element.tagName) {
                case 'INPUT':
                    event = 'keyup';
                    break;
            }
            this.bind(element, propertyPath, attr, event);
        }

        // Handle event bindings
        elements = elRoot.querySelectorAll('[data-ex-on');
        for (let element of elements) {
            let [evtName, callbackName] = element.getAttribute('data-ex-on').split(':');
            element.addEventListener(evtName, this.knownCallbacks[callbackName]);
        }
    }
}

const ex = new Exocore;
