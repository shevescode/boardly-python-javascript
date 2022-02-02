import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { columnsManager } from "./columnsManager.js";
import { boardsManager } from "./boardsManager.js";
import { buttonsManager } from "./buttonsManager.js";

export let formManager = {
  createChangeBoardTitleForm: async function (crntTitle, titleClass, parent) {
    const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
    const content = rowFormBuilder(`${crntTitle}`, 'btn-warning', titleClass, parent);
    domManager.insertFirstChild(`#${parent.id}`, content);
    domManager.addEventListener(
      `#change-${titleClass}-form-${parent.id}`,
      "submit",
      changeBoardTitle
    );
  },
  createSetBoardTitleForm: async function (titleClass, parent) {
    const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
    const content = rowFormBuilder('Enter Title...', 'btn-warning', titleClass, parent);
    domManager.addChild(`#${parent.id}`, content);
    console.log(parent)
    domManager.addEventListener(
      `#set-${titleClass}-form-${parent.id}`,
      "submit",
      setBoardTitle
    );
  },
  createChangeColumnTitleForm: async function (crntTitle, titleClass, parent) {
    const boardId = parent.dataset.boardId;
    const columnId = parent.dataset.columnId;
    const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
    const content = rowFormBuilder(`${crntTitle}`, 'btn-warning', titleClass, parent);
    domManager.insertFirstChild(`#board-${boardId}-column-${columnId}-body`, content);
    domManager.addEventListener(
      `#change-${titleClass}-form-${parent.id}`,
      "submit",
      changeColumnTitle
    );
  },
  createSetColumnTitleForm: async function (titleClass, parent) {
    const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
    const content = rowFormBuilder('Enter Title...', 'btn-warning', titleClass, parent);
    domManager.addChild(`#${parent.id}`, content);
    console.log(parent)
    domManager.addEventListener(
      `#set-${titleClass}-form-${parent.id}`,
      "submit",
      setColumnTitle
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
  boardsManager.changeBoardTitle(newTitle, oldTitle, parent, target)
}

function setColumnTitle(event){
  const target = event.currentTarget
  const parent = target.parentElement
  const container = parent.parentElement
  const newTitle = target.children[0].children[0].value
  columnsManager.createNewColumn(newTitle, parent, container)
}

function changeColumnTitle(event){
  const target = event.currentTarget;
  const parent = target.parentElement;
  const oldTitle = document.querySelector(`#new-title-${parent.id}`).placeholder;
  const newTitle = target.children[0].children[0].value;
  columnsManager.changeColumnTitle(newTitle, oldTitle, parent, target)
}

