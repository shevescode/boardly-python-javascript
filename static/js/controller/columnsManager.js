import {dataHandler} from "../data/dataHandler.js";
import {buttonTypes, columnTypes, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
import {buttonsManager} from "./buttonsManager.js";
import {deleteElement, renameElement} from "./boardsManager.js";

export let columnsManager = {
    loadColumn: function (columnId, boardId, columnTitle, columnContainer, selectedMode) {
        const columnBuilder = htmlFactory(htmlTemplates.column)
        const loadedColumn = columnBuilder(columnTypes.loadedColumn, columnId, boardId, columnTitle);
        if (selectedMode === mode.appendLast) {
            columnContainer.appendChild(loadedColumn);
        } else if (selectedMode === mode.insertBeforeLast) {
            columnContainer.insertBefore(loadedColumn, columnContainer.children[columnContainer.children.length - 1]);
        }
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
        const payload = {'id': parent.dataset.boardId, 'title': newTitle}
        const boardData = await dataHandler.changeBoardTitle(payload);
        const btnBuilder = htmlFactory(htmlTemplates.button)
        parent.removeChild(target)
        let content = null
        if (boardData === 'error') {
            content = btnBuilder(buttonTypes.boardTitleBtnGroup, 'secondary', 'none', parent.dataset.boardId, oldTitle);
        } else {
            content = btnBuilder(buttonTypes.boardTitleBtnGroup, 'secondary', 'none', parent.dataset.boardId, newTitle);
        }
        domManager.insertFirstChild(`#${parent.id}`, content);
        domManager.addEventListener(
            `#board-title-${parent.dataset.boardId}`,
            "click",
            loadBoardDataToDOM
        );
        domManager.addEventListener(
            `#rename-board-title-${parent.dataset.boardId}`,
            "click",
            renameElement
        );
        domManager.addEventListener(
            `#delete-board-title-${parent.dataset.boardId}`,
            "click",
            deleteElement
        );
    },
}
