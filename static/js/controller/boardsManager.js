import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import {columnManager} from "./columnManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boards = await dataHandler.getBoards();
    for (let board of boards) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(board, 12);
      domManager.addChild("#root", content);
      domManager.addEventListener(
        `#data-${board.id}.board-title`,
        "click",
        showHideButtonHandler
      );
    }
  },
  createNewBoard: async function (title) {
    const payload = {'title': title}
    const board = await dataHandler.createNewBoard(payload);
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board[0], 12);
    domManager.insertSecondChild("#root", content);
    domManager.addEventListener(
      `#data-${board[0].id}.board-title`,
      "click",
      showHideButtonHandler
    );
  },
};

function showHideButtonHandler(clickEvent) {
  const currentTarget = clickEvent.currentTarget
  // cardsManager.loadCards(currentTarget);
  columnManager.loadColumns(currentTarget);
  currentTarget.removeEventListener('click', showHideButtonHandler)
}
