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
    createDropZone: function (elementContainer, position, draggedElement) {
        const zoneBuilder = htmlFactory(htmlTemplates.zone);
        let content;
        let elementType = draggedElement.dataset.elementType
        if (elementType === "card-container") {
            let size = [0, draggedElement.offsetHeight]
            content = zoneBuilder(zoneTypes.cardDropZone, size);
        } else if (elementType === "column-container") {
            let size = [draggedElement.offsetWidth, draggedElement.offsetHeight]
            content = zoneBuilder(zoneTypes.columnDropZone, size);
        }
        domManager.insertBeforePosition(`#${elementContainer.id}`, content, position);
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
                    let offset = [-1, -(1+marginY/2)]
                    let topHalfZone = zoneBuilder(zoneTypes.cardHoverHalfZoneTop, size, offset, card.dataset.cardId)
                    let bottomHalfZone = zoneBuilder(zoneTypes.cardHoverHalfZoneBottom, size, offset, card.dataset.cardId)
                    domManager.addCardHoverHalfZones(`#${card.id}`, topHalfZone, bottomHalfZone);
                    domManager.setOnDragEnterHandler(`#${topHalfZone.id}`, onDragEnterCardHalfZoneHandler);
                    domManager.setOnDragEnterHandler(`#${bottomHalfZone.id}`, onDragEnterCardHalfZoneHandler);
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
    },
    dropDraggedElementIntoDropZone: function () {
        let dropZone = document.querySelector('#card-drop-zone');
        let elementContainer = dropZone.parentElement;
        let dropZoneIndex = Array.prototype.indexOf.call(elementContainer.children, dropZone);
        domManager.unsetDraggedElement(`#${draggedElement.id}`);
        domManager.removeElement('#card-drop-zone');
        domManager.insertBeforePosition(`#${elementContainer.id}`, draggedElement, dropZoneIndex);
    }
}

function onCardDragStartHandler(event) {
    draggedElement = event.currentTarget;
    let elementContainer = draggedElement.parentElement
    draggedElementLastPos = Array.prototype.indexOf.call(elementContainer.children, draggedElement);
    dragDropManager.createDropZone(elementContainer, draggedElementLastPos, draggedElement);
    domManager.setDraggedElement(`#${draggedElement.id}`);
    domManager.insertFirstChild('body', draggedElement);
    dragDropManager.createCardsHoverHalfZones();
    dragDropManager.setGhostImage(event);
}

function onDragEnterCardHalfZoneHandler(event){
    let eventTarget = event.currentTarget;
    let card = eventTarget.parentElement;
    let cardsContainer = card.parentElement;
    let cardIndex = Array.prototype.indexOf.call(cardsContainer.children, card);
    let dropZone = document.querySelector('#card-drop-zone')
    if (eventTarget.classList.contains('top-zone')){
        domManager.insertBeforePosition(`#${cardsContainer.id}`, dropZone, cardIndex);
    } else if (eventTarget.classList.contains('bottom-zone')){
        domManager.insertAfterPosition(`#${cardsContainer.id}`, dropZone, cardIndex)
    }
}

function onCardDragEndHandler (event) {
    let eventTarget = event.currentTarget
    domManager.removeAllCardHoverHalfZones(eventTarget.dataset.boardId)
    dragDropManager.dropDraggedElementIntoDropZone()
}