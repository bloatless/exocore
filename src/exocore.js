
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
            if (!this.knownCallbacks[callbackName]) {
                console.error('Unknown callback');
                return false;
            }
            element.addEventListener(evtName, this.knownCallbacks[callbackName]);
        }

        // Handle text bindings
        for (let dataKey in this.knownData) {

        }

        let textNodeWalker = document.createTreeWalker(
            elRoot,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    return (node.textContent.match(/{{\s?\$[\w.-]+\s?}}/) !== null);
                }
            }
        );
        while (textNodeWalker.nextNode()) {
            let textNode = textNodeWalker.currentNode;
            console.log(textNode);
        }


        // Handle template loops
        elements = elRoot.querySelectorAll('[data-ex-for');
        for (let element of elements) {
            let tmp = element.getAttribute('data-ex-for').match(/(\$\w+)\s+in\s+(\w+)/);
            let dataKey = tmp[2];
            let dataItemName = tmp[1];
            if (!this.knownData[dataKey]) {
                console.error('Unknown data');
                return false;
            }

            let elParent = element.parentElement;
            if (elParent === null) {
                continue;
            }

            elParent.innerHTML = '';

            for (let foo of this.knownData[dataKey]) {
                let elNew = document.createElement(element.tagName);
                elNew.innerHTML = element.innerHTML;
                elParent.appendChild(elNew);
            }
        }
    }
}

const ex = new Exocore;
