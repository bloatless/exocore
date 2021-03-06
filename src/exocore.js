import {Bindings} from "./bindings.js";
import {EventDispatcher} from "./dispatcher.js";
import {Observer} from "./observer.js";

class Exocore {
    constructor() {
        let eventDispatcher = new EventDispatcher;
        Observer.setEventDispatcher(eventDispatcher);
        this.ds = Observer.create({});
        this.bindings = new Bindings(eventDispatcher, this.ds);
    }

    init(elRoot = document) {

        let elements = elRoot.querySelectorAll('[data-ex-bind');
        for (let element of elements) {
            let propPath = element.getAttribute('data-ex-bind');

            switch (element.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                case 'SELECT':
                    this.bindings.addFormBinding(propPath, element);
                    break;
                default:
                    this.bindings.addDefaultBinding(propPath, element);
                    break;
            }
        }
    }

    /*
    introduce(key, item) {
        if (typeof item === 'function') {
            this.callbackContainer.add(key, item);
        } else {
            this.dataContainer.add(key, item);
        }
    }


    bind(domElement, propertyPath, attribute, event = null) {
        let objectKey = propertyPath.substr(0, propertyPath.lastIndexOf('.'));
        let propertyName = propertyPath.substr(propertyPath.lastIndexOf('.') + 1);
        if (!this.bindings[propertyPath]) {
            this.bindings[propertyPath] = new PropertyObserver(this.dataContainer.get(objectKey), propertyName);
        }
        this.bindings[propertyPath].addElementBinding(domElement, attribute, event);
    }

    init(elRoot = document) {

        // Handle default bindings
        let elements = elRoot.querySelectorAll('[data-ex-bind');
        for (let element of elements) {
            let dataValue = element.getAttribute('data-ex-bind');
            let attr = 'innerText';
            let propertyPath = dataValue;
            if (dataValue.indexOf(':') > 0) {
                [attr, propertyPath] = dataValue.split(':');
            }

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
            if (!this.callbackContainer.has(callbackName)) {
                console.error('Unknown callback');
                return false;
            }
            element.addEventListener(evtName, this.callbackContainer.get(callbackName));
        }

        // Handle text bindings
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
            let match = textNode.textContent.match(/{{\s?\$([\w.-]+)\s?}}/);
            let text = this.getData(match[1]);
            textNode.textContent = textNode.textContent.replace(match[0], text);
        }


        // Handle template loops
        elements = elRoot.querySelectorAll('[data-ex-for');
        for (let element of elements) {
            let tmp = element.getAttribute('data-ex-for').match(/(\$\w+)\s+in\s+(\w+)/);
            let dataKey = tmp[2];
            let dataItemName = tmp[1];
            if (!this.dataContainer.has(dataKey)) {
                console.error('Unknown data');
                return false;
            }

            let elParent = element.parentElement;
            if (elParent === null) {
                continue;
            }

            elParent.innerHTML = '';

            for (let foo of this.dataContainer.get(dataKey)) {
                let elNew = document.createElement(element.tagName);
                elNew.innerHTML = element.innerHTML;
                elParent.appendChild(elNew);
            }
        }

    }
    */
}

export default Exocore;