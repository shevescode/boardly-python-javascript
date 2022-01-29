import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardsManager } from "./boardsManager.js";
import { buttonsManager } from "./buttonsManager.js";

export let formManager = {
  createChangeTitleForm: async function (crntTitle, parent) {
    const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
    const content = rowFormBuilder(`${crntTitle}`, 'btn-warning', parent);
    domManager.insertFirstChild(`#${parent.id}`, content);
    domManager.addEventListener(
      "#changeTitleForm",
      "submit",
      changeBoardTitle
    );
  },
  createSetTitleForm: async function (parent) {
    const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
    const content = rowFormBuilder('Enter Board Title...', 'btn-warning', parent);
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
  boardsManager.createNewBoard(newTitle, 12)
  parent.removeChild(target)
  buttonsManager.createAddBoardButton()
}

function changeBoardTitle(event){
  //TODO
}
