import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
import {buttonsManager} from "./buttonsManager.js";
import {dragDropManager} from "./dragDropManager.js";

export let cardsManager = {
    loadCardTemplate: function (boardId, columnId, cardId, selectedMode, position) {
        const cardBuilder = htmlFactory(htmlTemplates.card);
        const content = cardBuilder(boardId, columnId, cardId);
        if (selectedMode === mode.appendLast) {
            domManager.addChild(`#board-${boardId}-column-${columnId}-card-container`, content);
        } else if (selectedMode === mode.insertBeforePosition) {
            domManager.insertBeforePosition(`#board-${boardId}-column-${columnId}-card-container`, content, position);
        } else if (selectedMode === mode.insertBeforeLast){
            domManager.insertBeforeLast(`#board-${boardId}-column-${columnId}-card-container`, content);
        }
    },
    loadCardContent: function (boardId, columnId, cardId, cardName, selectedMode, position) {
        this.loadCardTemplate(boardId, columnId, cardId, selectedMode, position);
        buttonsManager.createCardNameButtonGroup(boardId, columnId, cardId);
        dragDropManager.setDraggableCard(boardId, columnId, cardId);
        domManager.setInnerHTML(`#board-${boardId}-column-${columnId}-card-${cardId}-name`, cardName);
    },
    createPlaceholderCards: function (boardId, columnId){
        for (let i = 0; i < 2; i++) {
            cardsManager.loadCardTemplate(boardId, columnId, i, mode.appendLast)
            buttonsManager.createCardNameButtonGroup(boardId, columnId, i, true);
            domManager.disableButton(`#settings-board-${boardId}-column-${columnId}-card-${i}`);
        }
    },
    createNewCard: async function (name, formElement, cardContainer) {
        const boardId = cardContainer.dataset.boardId;
        const columnId = cardContainer.dataset.columnId;
        const payload = {'title': name, 'board_id': boardId, 'column_id': columnId};
        const boardData = await dataHandler.createNewCard(payload);
        domManager.removeElement(`#${formElement.id}`);
        buttonsManager.createAddCardButton(boardId, columnId);
        if (boardData !== 'error') {
            this.loadCardContent(boardId, columnId, boardData.id, boardData.title, mode.appendLast);
        }
    },
    changeCardName: async function (newName, oldName, parent, targetForm) {
        const boardId = parent.dataset.boardId;
        const columnId = parent.dataset.columnId;
        const cardId = parent.dataset.cardId;
        const payload = {'title': newName, 'card_id': cardId};
        const boardData = await dataHandler.changeCardName(payload);

        domManager.removeElement(`#${targetForm.id}`);
        buttonsManager.createCardNameButtonGroup(boardId, columnId, cardId);

        if (boardData === 'error') {
            domManager.setInnerHTML(`#board-${boardId}-column-${columnId}-card-${cardId}-name`, oldName);
        } else if (boardData['status'] === 'ok'){
            domManager.setInnerHTML(`#board-${boardId}-column-${columnId}-card-${cardId}-name`, newName);
        }
        dragDropManager.setDraggableCard(boardId, columnId, cardId)
    },
    deleteCard: async function (cardId, boardId, columnId) {
        const payload = {'card_id': cardId};
        await dataHandler.deleteCard(payload);
        domManager.removeElement(`#board-${boardId}-column-${columnId}-card-${cardId}-container`)
    }
};

