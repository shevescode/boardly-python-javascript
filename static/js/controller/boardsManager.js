import {dataHandler} from "../data/dataHandler.js";
import {buttonTypes, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {formManager} from "./formManager.js";
import {buttonsManager} from "./buttonsManager.js";
import {columnsManager} from "./columnsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boardsData = await dataHandler.getBoards();
        for (let boardData of boardsData) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(boardData.id);
            domManager.addChild("#root", content);
            buttonsManager.createBoardNameButtonGroup(boardData.id, boardData.title);
            columnsManager.createPlaceholderColumns(boardData);
        }
    },
    loadBoardContent: async function (eventTarget) {
        const boardId = eventTarget.dataset.boardId;
        const boardData = await dataHandler.getBoardDataById(boardId);
        const columnOrder = boardData[0];
        const columns = boardData[1];
        const cards = boardData[2];
        domManager.setDataLoaded(`#board-${boardId}-column-container`);
        domManager.purgeContainer(`#board-${boardId}-column-container`);
        for (const columnId of columnOrder) {
            for (let column of columns) {
                if (column['id'] === columnId) {
                    const columnName = column['title'];
                    columnsManager.loadColumnContent(boardId, columnId, columnName, mode.appendLast);
                    break;
                }
            }
        }
        for (const card of cards) {
            const columnId = card['status_id'];
            const cardId = card['id'];
            const cardName = card['title'];
            cardsManager.loadCardContent(boardId, columnId, cardId, cardName, mode.appendLast);
        }
        buttonsManager.createAddColumnButton(boardId);
    },
    createNewBoard: async function (name, target) {
        const payload = {'title': name};
        const boardData = await dataHandler.createNewBoard(payload);
        // console.log(boardData)
        domManager.removeElement(`#${target.id}`);
        buttonsManager.createAddBoardButton();
        if (boardData['status'] !== 'ok') {
            return;
        }
        const boardBuilder = htmlFactory(htmlTemplates.board);
        const content = boardBuilder(boardData.id);
        domManager.insertFirstChild("#root", content);
        buttonsManager.createBoardNameButtonGroup(boardData.id, boardData.title);
        columnsManager.createPlaceholderColumns(boardData);
    },
    changeBoardName: async function (newName, oldName, parent, formElement) {
        const payload = {'id': parent.dataset.boardId, 'title': newName};
        const boardData = await dataHandler.changeBoardName(payload);
        domManager.removeElement(`#${formElement.id}`);
        if (boardData['status'] === 'empty_title') {
            buttonsManager.createBoardNameButtonGroup(parent.dataset.boardId, oldName);
        } else if (boardData['status'] === 'ok') {
            buttonsManager.createBoardNameButtonGroup(parent.dataset.boardId, newName);
        }
    },
    deleteBoard: async function (boardId) {
        const payload = {'board_id': boardId};
        await dataHandler.deleteBoard(payload);
        domManager.removeElement(`#board-${boardId}-container`);
    }
};

export function loadBoardDataToDOM(clickEvent) {
    const eventTarget = clickEvent.currentTarget;
    const targetElement = eventTarget.parentElement.parentElement;
    if (targetElement.dataset.loaded !== 'true') {
        boardsManager.loadBoardContent(eventTarget);
        eventTarget.removeEventListener('click', loadBoardDataToDOM);
    } else {
        eventTarget.removeEventListener('click', loadBoardDataToDOM);
    }
}