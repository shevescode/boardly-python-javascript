import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardsManager } from "./boardsManager.js";
import { textFieldManager } from "./textFieldManager.js";

export let buttonsManager = {
  createAddBoardButton: async function () {
    const btnBuilder = htmlFactory(htmlTemplates.button);
    const content = btnBuilder('+New Board', 'btn-primary', 'add-board');
    domManager.addChild("#data-0.row", content);
    domManager.addEventListener(
      ".add-board",
      "click",
      replaceTargetWithTextField
    );
  },
};

function replaceTargetWithTextField(clickEvent) {
  let target = clickEvent.currentTarget;
  let parent = target.parentElement;
  parent.removeChild(target);
  textFieldManager.createSetTitleTextField(parent);
}
