import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardsManager } from "./boardsManager.js";
import { buttonManager } from "./buttonManager";

export let textFieldManager = {
  createChangeTitleTextField: async function (parent) {
    const textFieldBuilder = htmlFactory(htmlTemplates.textField);
    const content = textFieldBuilder('Enter Board Title...', parent);
    domManager.addChild(`#${parent.id}`, content);
    domManager.addEventListener(
      "#changeTitleForm",
      "submit",
      changeBoardTitle
    );
  },
  createSetTitleTextField: async function (parent) {
    const textFieldBuilder = htmlFactory(htmlTemplates.textField);
    const content = textFieldBuilder('Enter Board Title...', parent);
    domManager.addChild(`#${parent.id}`, content);
    domManager.addEventListener(
      "#changeTitleForm",
      "submit",
      setBoardTitle
    );
  },
};

function setBoardTitle(event){
  let eventTarget = event.currentTarget
  let parent = eventTarget.parent
  let newTitle = eventTarget.children[0].children[0].value
  boardsManager.createNewBoard(newTitle)
  parent.removeChild(eventTarget)
  buttonManager.createAddBoardButton()
}

function changeBoardTitle(event){
  //TODO
}
