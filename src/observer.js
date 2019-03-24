export const PropertyObserver = function(obj, prop) {
    let _this = this;
    this.currentValue = obj[prop] || null;
    this.elementBindings = [];

    this.onPropertyGet = () => {
        return _this.currentValue;
    };

    this.onPropertySet = value => {
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
                _this.onPropertySet(el[attr]);
            });
            binding.event = event;
        }
        this.elementBindings.push(binding);
        el[attr] = _this.currentValue;

        return _this;
    };

    Object.defineProperty(obj, prop, {
        get: this.onPropertyGet,
        set: this.onPropertySet
    });
};
