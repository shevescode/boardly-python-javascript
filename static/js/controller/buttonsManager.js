import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates, buttonTypes } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardsManager } from "./boardsManager.js";
import { formManager } from "./formManager.js";

export let buttonsManager = {
  createAddBoardButton: async function () {
    const btnBuilder = htmlFactory(htmlTemplates.button);
    const content = btnBuilder(buttonTypes.newBoardBtn, 'btn-warning', 'add-board');
    domManager.addChild("#new-board-button-container", content);
    domManager.addEventListener(
      ".add-board",
      "click",
      replaceBoardTitleForm
    );
  },
  createAddColumnButton: function (boardId) {
    const btnBuilder = htmlFactory(htmlTemplates.button);
    const content = btnBuilder(buttonTypes.newColumnBtn, 'btn-antracite', 'add-column-btn', boardId);
    domManager.addChild(`#board-${boardId}-column-container`, content)
    domManager.addEventListener(
      `#add-new-board-${boardId}-column-button`,
      "click",
      replaceColumnTitleForm
    );
  }
};

function replaceBoardTitleForm(clickEvent) {
  const target = clickEvent.currentTarget;
  const parent = target.parentElement;
  parent.removeChild(target);
  formManager.createSetBoardTitleForm(target.dataset.elementType, parent);
}

function replaceColumnTitleForm(clickEvent) {
  const target = clickEvent.currentTarget;
  const parent = target.parentElement;
  parent.removeChild(target);
  formManager.createSetColumnTitleForm(target.dataset.elementType, parent);
}
