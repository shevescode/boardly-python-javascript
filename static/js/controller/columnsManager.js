import {dataHandler} from "../data/dataHandler.js";
import {columnTypes, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
import {buttonsManager} from "./buttonsManager.js";

export let columnsManager = {
    loadColumn: function (columnId, boardId, columnTitle, columnContainer, selectedMode){
        const columnBuilder = htmlFactory(htmlTemplates.column)
        const loadedColumn = columnBuilder(columnTypes.loadedColumn, columnId, boardId, columnTitle);
        if (selectedMode === mode.appendLast){
            columnContainer.appendChild(loadedColumn);
        } else if (selectedMode === mode.insertBeforeLast){
            columnContainer.insertBefore(loadedColumn, columnContainer.children[columnContainer.children.length-1]);
        }
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
    }
}