import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
import {buttonsManager} from "./buttonsManager.js";

export let cardsManager = {
    loadCardTemplate: function (boardId, columnId, cardId, selectedMode, position) {
        const cardBuilder = htmlFactory(htmlTemplates.card);
        const content = cardBuilder(boardId, columnId, cardId);
        if (selectedMode === mode.appendLast) {
            domManager.addChild(`#board-${boardId}-column-${columnId}-card-container`, content)
        } else if (selectedMode === mode.insertAtPosition) {
            domManager.insertAtPosition(`#board-${boardId}-column-${columnId}-card-container`, content, position)
        } else if (selectedMode === mode.insertBeforeLast){
            domManager.insertBeforeLast(`#board-${boardId}-column-${columnId}-card-container`, content)
        }
    },
    loadCardContent: function (boardId, columnId, cardId, cardName, selectedMode) {
        this.loadCardTemplate(boardId, columnId, cardId, selectedMode);
        buttonsManager.createCardNameButtonGroup(boardId, columnId, cardId)
        domManager.setInnerHTML(`#board-${boardId}-column-${columnId}-card-${cardId}-name`, cardName);
    },
    createPlaceholderCards: function (boardId, columnId){
        for (let i = 0; i < 2; i++) {
            cardsManager.loadCardTemplate(boardId, columnId, i, mode.appendLast)
            buttonsManager.createCardNameButtonGroup(boardId, columnId, i, true)
        }
    },
    createNewCard: async function (name, formContainer, cardContainer) {
        const boardId = cardContainer.parentElement.dataset.boardId
        const columnId = cardContainer.parentElement.dataset.columnId
        const payload = {'title': name, 'board_id': boardId, 'column_id': columnId}
        const boardData = await dataHandler.createNewCard(payload);
        cardContainer.parentElement.removeChild(formContainer);
        buttonsManager.createAddCardButton(boardId, columnId)
        if (boardData !== 'error') {
            this.loadCardContent(boardData.id, columnId, boardId, boardData.title, cardContainer, mode.appendLast)
        }
    },
    changeCardName: async function (name, formContainer, cardContainer) {

    },
    deleteCard: function (name, formContainer, cardContainer) {

    }
};

