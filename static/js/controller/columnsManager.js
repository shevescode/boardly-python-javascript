import {dataHandler} from "../data/dataHandler.js";
import {buttonTypes, columnTypes, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
import {buttonsManager} from "./buttonsManager.js";
import {deleteElement, renameElement} from "./boardsManager.js";
import {cardsManager} from "./cardsManager.js";

export let columnsManager = {
    loadColumn: function (columnId, boardId, columnTitle, columnContainer, selectedMode, position) {
        const columnBuilder = htmlFactory(htmlTemplates.column)
        const loadedColumn = columnBuilder(columnTypes.loadedColumn, columnId, boardId, columnTitle);
        if (selectedMode === mode.appendLast) {
            columnContainer.appendChild(loadedColumn);
        } else if (selectedMode === mode.insertBeforeLast) {
            columnContainer.insertBefore(loadedColumn, columnContainer.children[columnContainer.children.length - 1]);
        } else if (selectedMode === mode.insertAtPosition) {
            columnContainer.insertBefore(loadedColumn, columnContainer.children[position]);
        }
        addColumnSettingsButtonEventListeners(boardId, columnId)
        buttonsManager.createAddCardButton(boardId, columnId)
    },

    createNewColumn: async function (title, formContainer, columnContainer) {
        const boardId = columnContainer.parentElement.dataset.boardId
        const payload = {'title': title, 'board_id': boardId}
        const boardData = await dataHandler.createNewColumn(payload);
        columnContainer.removeChild(formContainer);
        buttonsManager.createAddColumnButton(boardId)
        if (boardData === 'error') {
            return;
        }
        this.loadColumn(boardData[0].id, boardId, boardData[0].title, columnContainer, mode.insertBeforeLast)
    },

    changeColumnTitle: async function (newTitle, oldTitle, parent, target) {
        const boardId = parent.dataset.boardId;
        const columnId = parent.dataset.columnId;
        const payload = {'column_id': columnId, 'board_id': boardId, 'title': newTitle}
        const boardData = await dataHandler.changeColumnTitle(payload);
        const btnBuilder = htmlFactory(htmlTemplates.button)

        parent.removeChild(target);
        const colTittleGroup = btnBuilder(buttonTypes.columnTitleBtnGroup, 'btn-antracite',
            'btn-size-medium', [boardId, columnId])

        if (boardData === 'error') {
            colTittleGroup.children[0].innerHTML = oldTitle;
            parent.insertBefore(colTittleGroup, parent.children[0]);
            addColumnSettingsButtonEventListeners(boardId, columnId)

        } else if (boardData['ok'] === 'ok'){
            colTittleGroup.children[0].innerHTML = newTitle;
            parent.insertBefore(colTittleGroup, parent.children[0]);
            addColumnSettingsButtonEventListeners(boardId, columnId)

        } else {
            const columnContainer = parent.parentElement.parentElement
            const cards = boardData['cards']
            columnContainer.removeChild(parent.parentElement)
            this.loadColumn(boardData['column_id'], boardId, newTitle, columnContainer,
                            mode.insertAtPosition, boardData['position'])
            const cardsContainer = document.querySelector(`#board-${boardId}-column-${boardData['column_id']}-card-container`)
            for (let card of cards) {
                cardsManager.loadCard(card['id'], boardData['column_id'], boardId, card['title'], cardsContainer, mode.appendLast)
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


function addColumnSettingsButtonEventListeners(boardId, columnId){
    domManager.addEventListener(
        `#rename-board-${boardId}-column-${columnId}-title`,
        "click",
        renameElement
    );
    domManager.addEventListener(
        `#delete-board-${boardId}-column-${columnId}-title`,
        "click",
        deleteElement
    );
}
