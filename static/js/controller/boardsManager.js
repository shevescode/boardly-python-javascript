import { dataHandler } from "../data/dataHandler.js";
import {buttonTypes, htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import {formManager} from "./formManager.js";

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
  }
};

function loadBoardDataToDOM(clickEvent) {
  const currentTarget = clickEvent.currentTarget
  const targetParent = clickEvent.currentTarget
  if (targetParent.dataset.loaded !== 'true') {
    targetParent.setAttribute('data-loaded', 'true')
    cardsManager.loadCards(currentTarget);
  }
  currentTarget.removeEventListener('click', loadBoardDataToDOM)
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
