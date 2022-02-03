export let domManager = {
    addChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.appendChild(childContent)
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    insertFirstChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertBefore(childContent, parent.children[0]);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    insertSecondChild(parentIdentifier, childContent) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertBefore(childContent, parent.children[1]);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    insertBeforeLast(parentIdentifier, childContent){
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertBefore(childContent, parent.children[parent.children.length - 1]);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    insertAtPosition(parentIdentifier, childContent, position) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertBefore(childContent, parent.children[position]);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    enableButton(elementIdentifier){
        const element = document.querySelector(elementIdentifier);
        if (element) {
            element.classList.remove('disabled');
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    disableButton(elementIdentifier){
        const element = document.querySelector(elementIdentifier);
        if (element) {
            element.classList.add('disabled');
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    setDataLoaded(elementIdentifier){
        const element = document.querySelector(elementIdentifier);
        if (element) {
            element.setAttribute('data-loaded', 'true');
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    purgeContainer(elementIdentifier){
        const element = document.querySelector(elementIdentifier);
        if (element) {
            element.innerHTML = "";
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    removeElement(elementIdentifier){
        const element = document.querySelector(elementIdentifier);
        if (element) {
            element.remove()
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    setInnerHTML(elementIdentifier, content){
        const element = document.querySelector(elementIdentifier);
        if (element) {
            element.innerHTML = content;
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    addEventListener(elementIdentifier, eventType, eventHandler) {
        const parent = document.querySelector(elementIdentifier);
        if (parent) {
            parent.addEventListener(eventType, eventHandler);
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
};

export const mode = {
    appendLast: 'append',
    insertBeforeLast: 'insert before last',
    insertAtPosition: 'insert at position'
}
