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
        domManager.setOnDragStartHandler(`#board-${boardId}-column-${columnId}-card-${cardId}-container`, onCardDragStartHandler);
        domManager.setOnDragEndHandler(`#board-${boardId}-column-${columnId}-card-${cardId}-container`, onCardDragEndHandler);
    },
    createPlaceHolder: function (targetElement, position, elementType) {
        const zoneBuilder = htmlFactory(htmlTemplates.zone);
        let content;
        if (elementType === "card-container") {
            content = zoneBuilder(zoneTypes.cardDropZone);
        } else if (elementType === "column-container") {
            content = zoneBuilder(zoneTypes.columnDropZone);
        }
        domManager.insertAtPosition(`#${targetElement.id}`, content, position);
    },
    createCardsHoverHalfZones: function () {
        let columnsContainer = document.querySelector(`#board-${draggedElement.dataset.boardId}-column-container`)
        let zoneBuilder = htmlFactory(htmlTemplates.zone)
        for (let i = 0; i < columnsContainer.children.length-1; i++){
            let cardsContainer = columnsContainer.children[i].children[1]
            for (let card of cardsContainer.children){
                if (card.id !== "card-drop-zone"){
                    let draggedElementStyle = getComputedStyle(draggedElement);
                    let marginY = parseInt(draggedElementStyle.marginTop)
                    let size = [card.offsetWidth, card.offsetHeight/2 + marginY/2]
                    let offset = [-1, -1-(marginY/2)]
                    let topHalfZone = zoneBuilder(zoneTypes.cardHoverHalfZoneTop, card.dataset.cardId, size, offset)
                    let bottomHalfZone = zoneBuilder(zoneTypes.cardHoverHalfZoneBottom, card.dataset.cardId, size, offset)
                    domManager.addCardHoverHalfZones(`#${card.id}`, topHalfZone, bottomHalfZone);
                }
            }
        }
    },
    setGhostImage: function (event) {
        let draggedElementStyle = getComputedStyle(draggedElement);
        let marginHorizontal = parseInt(draggedElementStyle.marginLeft);
        let marginVertical = parseInt(draggedElementStyle.marginTop);
        void event.dataTransfer.setDragImage(draggedElement,
            (draggedElement.offsetWidth/1.8) + marginHorizontal,
            (draggedElement.offsetHeight/2) + marginVertical);
    }
}

function onCardDragStartHandler(event) {
    draggedElement = event.currentTarget;
    draggedElementLastPos = Array.prototype.indexOf.call(draggedElement.parentElement.children, draggedElement);
    dragDropManager.createPlaceHolder(draggedElement.parentElement, draggedElementLastPos, draggedElement.dataset.elementType);
    domManager.setDraggedElement(`#${draggedElement.id}`);
    domManager.insertFirstChild('body', draggedElement);
    dragDropManager.createCardsHoverHalfZones()
    dragDropManager.setGhostImage(event)
}

function onCardDragEndHandler (event) {
    event.currentTarget.classList.remove('.from-drag-stl');
}