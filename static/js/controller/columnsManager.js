import {dataHandler} from "../data/dataHandler.js";
import {columnTypes, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {buttonsManager} from "./buttonsManager.js";

export let columnsManager = {
    loadColumn: function (columnId, boardId, columnTitle, columnContainer){
        const columnBuilder = htmlFactory(htmlTemplates.column)
        const loadedColumn = columnBuilder(columnTypes.loadedColumn, columnId, boardId, columnTitle);
        columnContainer.appendChild(loadedColumn);
    },
    createNewColumn: async function (title, formContainer, columnContainer) {
        const boardId = columnContainer.parentElement.dataset.boardId
        const payload = {'title': title, 'board_id': boardId}
        const boardData = await dataHandler.createNewColumn(payload);
        console.log(boardData)
        if (boardData === 'error') {
            return;
        }
        columnContainer.removeChild(formContainer);
        this.loadColumn(boardData[0].id, boardId, boardData[0].title, columnContainer)
        buttonsManager.createAddColumnButton(boardId)
    }
}