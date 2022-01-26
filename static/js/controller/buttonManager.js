import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardsManager } from "./boardsManager.js";

export let buttonManager = {
  createAddBoardButton: async function () {
    const addBoardBtnBuilder = htmlFactory(htmlTemplates.button);
    const content = addBoardBtnBuilder('+New Board', 'btn-primary', 'add-board');
    domManager.insertFirstChild("#root", content);
    domManager.addEventListener(
      ".add-board",
      "click",
      newBoardAction
    );
  },
};

function newBoardAction(clickEvent) {
  boardsManager.createNewBoard()
}
