import { dataHandler } from "../data/dataHandler.js";
import {buttonTypes, columnTypes, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import {formManager} from "./formManager.js";
import {buttonsManager} from "./buttonsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boardsData = await dataHandler.getBoards();
    for (let boardData of boardsData) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(boardData);
      domManager.addChild("#root", content);
      domManager.addEventListener(
        `#board-title-${boardData.id}`,
        "click",
        loadBoardDataToDOM
      );
      domManager.addEventListener(
        `#rename-board-title-${boardData.id}`,
        "click",
        renameElement
      );
      domManager.addEventListener(
        `#delete-board-title-${boardData.id}`,
        "click",
        deleteElement
      );
    }
  },
  createNewBoard: async function (title) {
    const payload = {'title': title}
    const boardData = await dataHandler.createNewBoard(payload);
    if (boardData === 'error') {
      return;
    }
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(boardData[0]);
    domManager.insertFirstChild("#root", content);
    domManager.addEventListener(
        `#board-title-${boardData[0].id}`,
        "click",
        loadBoardDataToDOM
    );
  },
  changeBoardTitle: async function (newTitle, oldTitle, parent) {
    const payload = {'id': parent.dataset.boardId, 'title': newTitle}
    const boardData = await dataHandler.changeBoardTitle(payload);
    const btnBuilder = htmlFactory(htmlTemplates.button)
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
  loadBoardData: async function (currentTarget, targetParent) {
    const boardId = currentTarget.dataset.boardId;
    const boardData = await dataHandler.getBoardDataById(boardId);
    const columnOrder = boardData[0];
    const columns = boardData[1];
    const cards = boardData[2];
    const columnBuilder = htmlFactory(htmlTemplates.column)
    const boardColumnContainer = targetParent.children[1].children[0];

    currentTarget.removeEventListener('click', loadBoardDataToDOM)
    targetParent.setAttribute('data-loaded', 'true')
    boardColumnContainer.innerHTML = "";

    for (let i in columnOrder){
      let columnTitle = ''
      const columnId = columnOrder[i]
      for (let j in columns){
        if (columns[j]['id'] === columnId) {
          columnTitle = columns[j]['title'];
        }
      }
      const loadedColumn = columnBuilder(columnTypes.loadedColumn, columnId, boardId, columnTitle);
      boardColumnContainer.appendChild(loadedColumn);
      //TODO - append loaded column (use column builder)
      //TODO load cards to corresponding column
    }
    buttonsManager.createAddColumnButton(boardId)
  }
};

function loadBoardDataToDOM(clickEvent) {
  const currentTarget = clickEvent.currentTarget
  const targetParent = clickEvent.currentTarget.parentElement.parentElement
  if (targetParent.dataset.loaded !== 'true') {
    boardsManager.loadBoardData(currentTarget, targetParent);
  } else {
    currentTarget.removeEventListener('click', loadBoardDataToDOM)
  }
}

function renameElement(clickEvent){
  const currentTarget = clickEvent.currentTarget
  const targetId = currentTarget.dataset.targetId
  const renamedElement = document.querySelector(`#${targetId}`)
  const currentTitle = renamedElement.innerHTML
  const renamedElementParent = renamedElement.parentElement.parentElement

  renamedElementParent.removeChild(renamedElement.parentElement);
  formManager.createChangeTitleForm(currentTitle, renamedElementParent);
}

function deleteElement(clikEvent){

}
