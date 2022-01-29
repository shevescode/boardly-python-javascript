import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boardsData = await dataHandler.getBoards();
    for (let boardData of boardsData) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(boardData);
      domManager.addChild("#root", content);
      domManager.addEventListener(
        `#board-title-${boardData.id}.board-title`,
        "click",
        loadBoardDataToDOM
      );
    }
  },
  createNewBoard: async function (title) {
    const payload = {'title': title}
    const boardData = await dataHandler.createNewBoard(payload);
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(boardData[0]);
    domManager.insertFirstChild("#root", content);
    domManager.addEventListener(
      `#board-title-${boardData[0].id}.board-title`,
      "click",
      loadBoardDataToDOM
    );
  },
};

function loadBoardDataToDOM(clickEvent) {
  const currentTarget = clickEvent.currentTarget
  cardsManager.loadCards(currentTarget);
  currentTarget.removeEventListener('click', loadBoardDataToDOM)
}
