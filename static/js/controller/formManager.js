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
  const target = event.currentTarget
  const parent = target.parentElement
  const newTitle = target.children[0].children[0].value
  boardsManager.createNewBoard(newTitle)
  parent.removeChild(target)
  buttonsManager.createAddBoardButton()
}

function changeBoardTitle(event){
  const target = event.currentTarget;
  const parent = target.parentElement;
  const oldTitle = document.querySelector(`#new-title-${parent.id}`).placeholder;
  const newTitle = target.children[0].children[0].value;
  parent.removeChild(target)
  boardsManager.changeBoardTitle(newTitle, oldTitle, parent)
}
