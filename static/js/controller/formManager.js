import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";
import { columnsManager } from "./columnsManager.js";
import { boardsManager } from "./boardsManager.js";
import { buttonsManager } from "./buttonsManager.js";
import {dragDropManager} from "./dragDropManager.js";

export let formManager = {
    createSetBoardNameForm: function (nameClass, parent) {
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder('Enter new title...', 'btn-warning', nameClass, parent);
        domManager.addChild(`#${parent.id}`, content);
        domManager.addEventListener(`#set-${nameClass}-form-${parent.id}`,
                                    "submit", setBoardName);
    },
    createSetColumnNameForm: function (nameClass, parent) {
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder('Enter new title...', 'btn-warning', nameClass, parent);
        domManager.addChild(`#${parent.id}`, content);
        domManager.addEventListener(`#set-${nameClass}-form-${parent.id}`,
                                    "submit", setColumnName);
    },
    createSetCardNameForm: function (nameClass, parent) {
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder('Enter card name...', 'btn-warning', nameClass, parent);
        domManager.addChild(`#${parent.id}`, content);
        domManager.addEventListener(`#set-${nameClass}-form-${parent.id}`,
                                    "submit", setCardName);
    },
    createChangeNameForm: async function (crntName, nameClass, parent) {
        const rowFormBuilder = htmlFactory(htmlTemplates.rowForm);
        const content = rowFormBuilder(crntName, 'btn-warning', nameClass, parent);
        domManager.insertFirstChild(`#${parent.id}`, content);
        domManager.addEventListener(`#change-${nameClass}-form-${parent.id}`,
                                    "submit", changeName);
        if (parent.dataset.elementType === 'card-container'){
            dragDropManager.unsetDragableCard(parent.dataset.boardId, parent.dataset.columnId, parent.dataset.cardId)
        }
    },
};

export function replaceBoardNameWithForm(clickEvent) {
    const target = clickEvent.currentTarget;
    const parent = target.parentElement;
    domManager.removeElement(`#${target.id}`);
    formManager.createSetBoardNameForm(target.dataset.elementType, parent);
}

export function replaceColumnNameWithForm(clickEvent) {
    const target = clickEvent.currentTarget;
    const parent = target.parentElement;
    domManager.removeElement(`#${target.id}`);
    formManager.createSetColumnNameForm(target.dataset.elementType, parent);
}

export function replaceCardNameWithForm(clickEvent) {
    const target = clickEvent.currentTarget;
    const parent = target.parentElement;
    domManager.removeElement(`#${target.id}`);
    formManager.createSetCardNameForm(target.dataset.elementType, parent);
}

function setBoardName(event){
    const target = event.currentTarget;
    const newName = target.children[0].children[0].value;
    boardsManager.createNewBoard(newName, target);

}

function setColumnName(event){
    const target = event.currentTarget;
    const parent = target.parentElement;
    const container = parent.parentElement;
    const newName = target.children[0].children[0].value;
    columnsManager.createNewColumn(newName, parent, container);
}

function setCardName(event){
    const target = event.currentTarget;
    const container = target.parentElement.parentElement;
    const newName = target.children[0].children[0].value;
    cardsManager.createNewCard(newName, target, container);
}

function changeName(event){
    const target = event.currentTarget;
    const parent = target.parentElement;
    const oldName = document.querySelector(`#new-name-${parent.id}`).placeholder;
    const newName = target.children[0].children[0].value;
    const elementType = parent.dataset.elementType;

    if (elementType === "board-container") {
        boardsManager.changeBoardName(newName, oldName, parent, target);
    } else if (elementType === "column-container") {
        columnsManager.changeColumnName(newName, oldName, parent, target);
    } else if (elementType === "card-container") {
        cardsManager.changeCardName(newName, oldName, parent, target);
    }
}
