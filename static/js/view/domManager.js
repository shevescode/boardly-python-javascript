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
    insertBeforePosition(parentIdentifier, childContent, position) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            parent.insertBefore(childContent, parent.children[position]);
        } else {
            console.error("could not find such html element: " + parentIdentifier);
        }
    },
    insertAfterPosition(parentIdentifier, childContent, position) {
        const parent = document.querySelector(parentIdentifier);
        if (parent) {
            if (parent.children[position].nextElementSibling === null){
                parent.appendChild(childContent)
            } else {
                parent.insertBefore(childContent, parent.children[position].nextElementSibling);
            }
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
    setDraggable(elementIdentifier) {
        const parent = document.querySelector(elementIdentifier);
        if (parent) {
            parent.setAttribute('draggable', "true");
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    unsetDraggable(elementIdentifier) {
                const parent = document.querySelector(elementIdentifier);
        if (parent) {
            parent.setAttribute('draggable', "false");
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    setOnDragStartHandler(elementIdentifier, onDragStartHandler) {
        const parent = document.querySelector(elementIdentifier);
        if (parent) {
            parent.ondragstart = onDragStartHandler;
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    setOnDragEnterHandler(elementIdentifier, onDragEnterHandler) {
        const parent = document.querySelector(elementIdentifier);
        if (parent) {
            parent.ondragenter = onDragEnterHandler;
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    unsetOnDragEnterHandler(elementIdentifier) {
        const parent = document.querySelector(elementIdentifier);
        if (parent) {
            parent.ondragenter = null;
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    setOnDragEndHandler(elementIdentifier, onDragEndHandler) {
        const parent = document.querySelector(elementIdentifier);
        if (parent) {
            parent.ondragend = onDragEndHandler;
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    setDraggedElement(elementIdentifier){
        const draggedElement = document.querySelector(elementIdentifier);
        if (draggedElement) {
            draggedElement.style = `width: ${draggedElement.offsetWidth}px`;
            draggedElement.style.top = "-1000px";
            draggedElement.classList.add('position-absolute');
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    unsetDraggedElement(elementIdentifier){
        const draggedElement = document.querySelector(elementIdentifier);
        if (draggedElement) {
            draggedElement.style.width = null;
            draggedElement.style.top = null;
            draggedElement.classList.remove('position-absolute');
        } else {
            console.error("could not find such html element: " + elementIdentifier);
        }
    },
    addCardHoverHalfZones(cardIdentifier, topHalfZone, bottomHalfZone){
        const card = document.querySelector(cardIdentifier);
        if (card) {
            card.appendChild(topHalfZone);
            card.appendChild(bottomHalfZone);
        } else {
            console.error("could not find such html element: " + cardIdentifier);
        }
    },
    removeAllCardHoverHalfZones(boardId) {
        const columnsContainer = document.querySelector(`#board-${boardId}-column-container`);
        for (let i = 0; i < columnsContainer.children.length - 1; i++) {
            let cardsContainer = columnsContainer.children[i].children[1]
            for (let card of cardsContainer.children) {
                if (card.id !== "card-drop-zone") {
                    let cardId = card.dataset.cardId
                    document.querySelector(`#card-${cardId}-hover-half-zone-bottom`).remove()
                    document.querySelector(`#card-${cardId}-hover-half-zone-top`).remove()
                }
            }
        }
    }
};

export const mode = {
    appendLast: 'append',
    insertBeforeLast: 'insert before last',
    insertBeforePosition: 'insert at position'
}
