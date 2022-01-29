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
      replaceTargetTitleForm
    );
  },
};

function replaceTargetTitleForm(clickEvent) {
  let target = clickEvent.currentTarget;
  let parent = target.parentElement;
  parent.removeChild(target);
  formManager.createSetTitleForm(parent);
}
