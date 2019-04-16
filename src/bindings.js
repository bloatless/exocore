export class Bindings {
    constructor(eventDispatcher, ds) {
        this.eventDispatcher = eventDispatcher;
        this.ds = ds;
        this.bindings = {};

        eventDispatcher.on('dataStoreChange', data => {
            this.update(data.propPath, data.propValue);
        });
    }

    addDefaultBinding(propPath, domElement) {
        let propPathItems = propPath.split('.');
        this.bindings = this._addBinding(this.bindings, {
            type: 'simple',
            el: domElement
        }, propPathItems);
    }

    addFormBinding(propPath, domElement) {

        switch (domElement.tagName) {
            case 'INPUT':
                domElement.addEventListener('keyup', event => {
                    let propPath = event.target.getAttribute('data-ex-bind');
                    this.ds[propPath] = event.target.value;
                });
                break;
            case 'TEXTAREA':
                break;
            case 'SELECT':
                break;
        }

        let propPathItems = propPath.split('.');
        this.bindings = this._addBinding(this.bindings, {
            type: 'form',
            el: domElement
        }, propPathItems);
    }

    update(propPath, propValue) {

        let pathItems = propPath.split('.');
        let pathBindings = this._getBindings(this.bindings, pathItems);
        if (pathBindings === null) {
            return;
        }

        this._updateBindings(pathBindings, propValue);
    }

    _addBinding(container, binding, path = []) {
        let pathItem = path.shift();
        if (container === null) {
            container = {};
        }
        if (!container.hasOwnProperty(pathItem)) {
            container[pathItem] = {
                bindings: [],
                children: null
            }
        }
        if (path.length > 0) {
            container[pathItem].children = this._addBinding(container[pathItem].children, binding, path);
        } else {
            container[pathItem].bindings.push(binding);
        }
        return container;
    }

    _getBindings(container, path = []) {
        let pathItem = path.shift();
        if (!container.hasOwnProperty(pathItem)) {
            return null;
        }
        let bindings = container[pathItem];
        if (path.length > 0) {
            return this._getBindings(bindings.children, path);
        }
        return bindings;
    }

    _updateBindings(pathBindings, propValue) {

        // @todo Compare object properies and bindings

        // update binding
        for (let binding of pathBindings.bindings) {
            if (binding.type === 'simple') {
                binding.el.innerText = propValue;
            } else if (binding.type === 'form') {
                binding.el.value = propValue;
            }
        }

    }
}
