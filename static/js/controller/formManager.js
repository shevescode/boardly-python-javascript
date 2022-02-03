import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { columnsManager } from "./columnsManager.js";
import { boardsManager } from "./boardsManager.js";
import { buttonsManager } from "./buttonsManager.js";

export let formManager = {
    createSetBoardNameForm: function (nameClass, parent) {
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder('Enter new title...', 'btn-warning', nameClass, parent);
        domManager.addChild(`#${parent.id}`, content);
        domManager.addEventListener(`#set-${nameClass}-form-${parent.id}`,
                                    "submit", setBoardName
        );
    },
    createSetColumnNameForm: function (nameClass, parent) {
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder('Enter new title...', 'btn-warning', nameClass, parent);
        domManager.addChild(`#${parent.id}`, content);
        domManager.addEventListener(`#set-${nameClass}-form-${parent.id}`,
                                    "submit", setColumnName
        );
    },
    createSetCardNameForm: function (nameClass, parent) {
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder('Enter card name...', 'btn-warning', nameClass, parent);
        const boardId = parent.parentElement.dataset.boardId
        const columnId = parent.parentElement.dataset.columnId
        domManager.addChild(`#${parent.id}`, content);
        domManager.addEventListener(`#set-${nameClass}-form-${parent.id}`,
                                    "submit", setCardName
        );
    },
    createChangeBoardNameForm: async function (crntName, nameClass, parent) {
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder(crntName, 'btn-warning', nameClass, parent);
        domManager.insertFirstChild(`#${parent.id}`, content);
        domManager.addEventListener(`#change-${nameClass}-form-${parent.id}`,
                                    "submit", changeBoardName
        );
    },
    createChangeColumnNameForm: function (crntName, nameClass, parent) {
        const boardId = parent.dataset.boardId;
        const columnId = parent.dataset.columnId;
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder(crntName, 'btn-warning', nameClass, parent);
        domManager.insertFirstChild(`#board-${boardId}-column-${columnId}-body`, content);
        domManager.addEventListener(`#change-${nameClass}-form-${parent.id}`,
                                    "submit", changeColumnName
        );
    },
    createChangeCardNameForm: function (crntName, nameClass, parent) {
        const boardId = parent.dataset.boardId;
        const columnId = parent.dataset.columnId;
        const cardId = parent.dataset.cardId;
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder(crntName, 'btn-warning', nameClass, parent);
        domManager.insertFirstChild(`#board-${boardId}-column-${columnId}-body`, content); //TODO need to check selector
        domManager.addEventListener(`#change-${nameClass}-form-${parent.id}`,
                                    "submit", changeColumnName
        );
    },
};

export function replaceBoardNameWithForm(clickEvent) {
    const target = clickEvent.currentTarget;
    const parent = target.parentElement;
    parent.removeChild(target);
    formManager.createSetBoardNameForm(target.dataset.elementType, parent);
}

export function replaceColumnNameWithForm(clickEvent) {
    const target = clickEvent.currentTarget;
    const parent = target.parentElement;
    parent.removeChild(target);
    formManager.createSetColumnNameForm(target.dataset.elementType, parent);
}

export function replaceCardNameWithForm(clickEvent) {
    const target = clickEvent.currentTarget;
    const parent = target.parentElement;
    parent.removeChild(target);
    formManager.createSetCardNameForm(target.dataset.elementType, parent);
}

function setBoardName(event){
    const target = event.currentTarget
    const newName = target.children[0].children[0].value
    boardsManager.createNewBoard(newName, target)
    target.remove()
    buttonsManager.createAddBoardButton()
}

function setColumnName(event){
    const target = event.currentTarget
    const parent = target.parentElement
    const container = parent.parentElement
    const newName = target.children[0].children[0].value
    columnsManager.createNewColumn(newName, parent, container)
}

function setCardName(event){
    const target = event.currentTarget
    const parent = target.parentElement
    const container = parent.parentElement.children[1]
    const newName = target.children[0].children[0].value
    cardsManager.createNewCard(newName, parent, container)
}

function changeBoardName(event){
    const target = event.currentTarget;
    const parent = target.parentElement;
    const oldName = document.querySelector(`#new-name-${parent.id}`).placeholder;
    const newName = target.children[0].children[0].value;
    boardsManager.changeBoardName(newName, oldName, parent, target)
}

function changeColumnName(event){
    const target = event.currentTarget;
    const parent = target.parentElement;
    const oldName = document.querySelector(`#new-name-${parent.id}`).placeholder;
    const newName = target.children[0].children[0].value;
    columnsManager.changeColumnName(newName, oldName, parent, target)
}

function changeCardName(event){

}
