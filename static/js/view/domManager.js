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
  addEventListener(parentIdentifier, eventType, eventHandler) {
    const parent = document.querySelector(parentIdentifier);
    if (parent) {
      parent.addEventListener(eventType, eventHandler);
    } else {
      console.error("could not find such html element: " + parentIdentifier);
    }
  },
};

export const mode = {
    appendLast: 'append',
    insertBeforeLast: 'insert before last'
}
