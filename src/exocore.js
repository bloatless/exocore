
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
        this.knownObjects = {};
        this.bindings = {};
    }

    introduce(name, object) {
        this.knownObjects[name] = object;
    }

    bind(domElement, propertyPath, attribute, event = null) {
        let [objectName, propertyName] = propertyPath.split('.');
        if (!this.bindings[propertyPath]) {
            this.bindings[propertyPath] = new Binding(this.knownObjects[objectName], propertyName);
        }

        this.bindings[propertyPath].addElementBinding(domElement, attribute, event);
    }
}

const ex = new Exocore;
