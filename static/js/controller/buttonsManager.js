import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates, buttonTypes } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardsManager } from "./boardsManager.js";
import { textFieldManager } from "./textFieldManager.js";

export let buttonsManager = {
  createAddBoardButton: async function () {
    const btnBuilder = htmlFactory(htmlTemplates.button);
    const content = btnBuilder(buttonTypes.newBoardBtn, 'btn-primary', 'add-board');
    domManager.addChild("#data-0.row", content);
    domManager.addEventListener(
      ".add-board",
      "click",
      replaceTargetWithTextField
    );
  },
  createSubmitButton: async function (formIdentifier) {
    const btnBuilder = htmlFactory(htmlTemplates.button);
    const content = btnBuilder(buttonTypes.submitBtn, 'btn-primary', 'submit-button');
    domManager.addChild(formIdentifier, content);
  },
};

function replaceTargetWithTextField(clickEvent) {
  let target = clickEvent.currentTarget;
  let parent = target.parentElement;
  parent.removeChild(target);
  textFieldManager.createSetTitleTextField(parent);
}
