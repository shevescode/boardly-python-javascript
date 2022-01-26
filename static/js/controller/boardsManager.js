import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boards = await dataHandler.getBoards();
    for (let board of boards) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(board);
      domManager.addChild("#root", content);
      domManager.addEventListener(
        `.board-title[data-board-id="${board.id}"]`,
        "click",
        showHideButtonHandler
      );
    }
  },
  createNewBoard: async function () {
    const board = await dataHandler.createNewBoard();
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board[0]);
    domManager.insertSecondChild("#root", content);
    domManager.addEventListener(
      `.board-title[data-board-id="${board[0].id}"]`,
      "click",
      showHideButtonHandler
    );
  },
};

function showHideButtonHandler(clickEvent) {
  const currentTarget = clickEvent.currentTarget
  const boardId = currentTarget.dataset.boardId;
  cardsManager.loadCards(boardId);
  currentTarget.removeEventListener('click', showHideButtonHandler)
}
