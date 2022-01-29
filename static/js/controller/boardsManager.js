import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
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
    if (boardData !== 'error'){
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(boardData[0]);
      domManager.insertFirstChild("#root", content);
      domManager.addEventListener(
          `#board-title-${boardData[0].id}`,
          "click",
          loadBoardDataToDOM
      );
    }
  },
};

function loadBoardDataToDOM(clickEvent) {
  const currentTarget = clickEvent.currentTarget
  cardsManager.loadCards(currentTarget);
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
