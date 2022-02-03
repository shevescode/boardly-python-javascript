import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates, zoneTypes} from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
let draggedElement;
let draggedElementLastPos;

export let dragDropManager = {
    setDraggableColumn: function (boardId, columnId) {
        // TODO
    },
    setDraggableCard: function (boardId, columnId, cardId) {
        domManager.setDraggable(`#board-${boardId}-column-${columnId}-card-${cardId}-container`);
        domManager.setOnDragStartHandler(`#board-${boardId}-column-${columnId}-card-${cardId}-container`, onDragStartHandler);
        domManager.setOnDragEndHandler(`#board-${boardId}-column-${columnId}-card-${cardId}-container`, onDragEndHandler);
    },
    createPlaceHolder: function (targetElement, position, elementType) {
        const dropZoneBuilder = htmlFactory(htmlTemplates.dropzone);
        let content;
        if (elementType === "card-container") {
            content = dropZoneBuilder(zoneTypes.cardDropZone);
        } else if (elementType === "column-container") {
            content = dropZoneBuilder(zoneTypes.columnDropZone);
        }
        console.log("print")
        domManager.insertAtPosition(`#${targetElement.id}`, content, position);
    }
}

const onDragStartHandler = (evt) => {
    draggedElement = evt.currentTarget;
    draggedElementLastPos = Array.prototype.indexOf.call(draggedElement.parentElement.children, draggedElement);
    console.log(draggedElementLastPos);
    dragDropManager.createPlaceHolder(draggedElement.parentElement, draggedElementLastPos, draggedElement.dataset.elementType);
    domManager.removeElement(`#${draggedElement.id}`)
    // setDropZonesActiveUI();
}

const onDragEndHandler = (evt) => {
  evt.currentTarget.classList.remove('.from-drag-stl');
  // setDropZonesDefaultUI();
}