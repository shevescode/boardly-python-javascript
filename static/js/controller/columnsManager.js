import {dataHandler} from "../data/dataHandler.js";
import {buttonTypes, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
import {buttonsManager} from "./buttonsManager.js";
import {cardsManager} from "./cardsManager.js";

export let columnsManager = {
    loadColumnTemplate: function (boardId, columnId, selectedMode, position) {
        const columnBuilder = htmlFactory(htmlTemplates.column)
        const loadedColumn = columnBuilder(boardId, columnId);
        if (selectedMode === mode.appendLast) {
            domManager.addChild(`#board-${boardId}-column-container`, loadedColumn);
        } else if (selectedMode === mode.insertBeforeLast) {
            domManager.insertBeforeLast(`#board-${boardId}-column-container`, loadedColumn);
        } else if (selectedMode === mode.insertAtPosition) {
            domManager.insertAtPosition(`#board-${boardId}-column-container`, loadedColumn, position);
        }
    },
    loadColumnContent: function (boardId, columnId, columnName, selectedMode){
        this.loadColumnTemplate(boardId, columnId, selectedMode);
        buttonsManager.createAddCardButton(boardId, columnId)
        buttonsManager.createColumnNameButtonGroup(boardId, columnId, "")
        domManager.setInnerHTML(`#board-${boardId}-column-${columnId}-name`, columnName);
    },
    createPlaceholderColumns: function (boardData){
        const boardId = boardData['id']
        for (let columnId of boardData['statuses']){
            this.loadColumnTemplate(boardId, columnId, mode.appendLast)
            buttonsManager.createAddCardButton(boardId, columnId, true)
            buttonsManager.createColumnNameButtonGroup(boardId, columnId, true)
            domManager.disableButton(`#settings-board-${boardId}-column-${columnId}-name`)
            cardsManager.createPlaceholderCards(boardId, columnId)
        }
        buttonsManager.createAddColumnButton(boardId, true)
    },
    createNewColumn: async function (name, formContainer, columnContainer) {
        const boardId = columnContainer.parentElement.dataset.boardId
        const payload = {'title': name, 'board_id': boardId}
        const boardData = await dataHandler.createNewColumn(payload);
        formContainer.remove();
        buttonsManager.createAddColumnButton(boardId)
        if (boardData === 'error') {
            return;
        }
        const columnId = boardData[0]['id']
        const columnName = boardData[0]['title']
        this.loadColumnContent(boardId, columnId, columnName, mode.insertBeforeLast)
    },
    changeColumnName: async function (newName, oldName, parent, target) {
        const boardId = parent.dataset.boardId;
        const columnId = parent.dataset.columnId;
        const payload = {'column_id': columnId, 'board_id': boardId, 'title': newName}
        const boardData = await dataHandler.changeColumnName(payload);
        const btnBuilder = htmlFactory(htmlTemplates.button)

        parent.removeChild(target);
        const colTittleGroup = btnBuilder('btn-antracite', 'btn-size-medium', [boardId, columnId])

        if (boardData === 'error') {
            colTittleGroup.children[0].innerHTML = oldName;
            parent.insertBefore(colTittleGroup, parent.children[0]);
            // addColumnSettingsButtonEventListeners(boardId, columnId)

        } else if (boardData['ok'] === 'ok'){
            colTittleGroup.children[0].innerHTML = newName;
            parent.insertBefore(colTittleGroup, parent.children[0]);
            // addColumnSettingsButtonEventListeners(boardId, columnId)

        } else {
            const columnContainer = parent.parentElement.parentElement
            const cards = boardData['cards']
            columnContainer.removeChild(parent.parentElement)
            this.loadColumnContent(boardData['column_id'], boardId, newName, columnContainer,
                            mode.insertAtPosition, boardData['position'])
            const cardsContainer = document.querySelector(`#board-${boardId}-column-${boardData['column_id']}-card-container`)
            for (let card of cards) {
                cardsManager.loadCardTemplate(card['id'], boardData['column_id'], boardId, card['title'], cardsContainer, mode.appendLast)
            }
        }
    },
    deleteColumn: async function (parent) {
        const boardId = parent.dataset.boardId;
        const columnId = parent.dataset.columnId;
        const payload = {'column_id': columnId, 'board_id': boardId}
        await dataHandler.deleteColumn(payload);

        parent.remove();
    }
}
