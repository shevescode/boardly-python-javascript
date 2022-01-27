import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardsManager } from "./boardsManager.js";
import { buttonsManager } from "./buttonsManager.js";

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
  let target = event.currentTarget
  let parent = target.parentElement
  let newTitle = target.children[0].children[0].value
  boardsManager.createNewBoard(newTitle)
  parent.removeChild(target)
  buttonsManager.createAddBoardButton()
}

function changeBoardTitle(event){
  //TODO
}
