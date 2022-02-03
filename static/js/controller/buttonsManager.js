import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates, buttonTypes} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {boardsManager, loadBoardDataToDOM} from "./boardsManager.js";
import {formManager, replaceBoardNameWithForm, replaceColumnNameWithForm, replaceCardNameWithForm} from "./formManager.js";
import {columnsManager} from "./columnsManager.js";

export let buttonsManager = {
    createAddBoardButton: function () {
        const btnBuilder = htmlFactory(htmlTemplates.button);
        const content = btnBuilder(buttonTypes.newBoardBtn, 'btn-warning', 'add-board');
        domManager.addChild("#new-board-button-container", content);
        domManager.addEventListener(
            ".add-board",
            "click",
            replaceBoardNameWithForm
        );
    },
    createAddColumnButton: function (boardId, disabled=false) {
        const btnBuilder = htmlFactory(htmlTemplates.button);
        const content = btnBuilder(buttonTypes.newColumnBtn, 'btn-antracite', 'add-column-btn', boardId);
        domManager.addChild(`#board-${boardId}-column-container`, content)
        if (disabled){
            domManager.disableButton(`#board-${boardId}-add-new-column-button`, content)
        }
        domManager.addEventListener(
            `#board-${boardId}-add-new-column-button`,
            "click",
            replaceColumnNameWithForm
        );
    },
    createAddCardButton: function (boardId, columnId, disabled=false) {
        const btnBuilder = htmlFactory(htmlTemplates.button);
        const content = btnBuilder(buttonTypes.newCardBtn, 'btn-antracite', 'add-card-btn', [boardId, columnId]);
        domManager.addChild(`#board-${boardId}-column-${columnId}-add-new-card-button-wrapper`, content)
        if (disabled){
            domManager.disableButton(`#board-${boardId}-column-${columnId}-add-new-card-button`, content)
        }
        domManager.addEventListener(
            `#board-${boardId}-column-${columnId}-add-new-card-button`,
            "click",
            replaceCardNameWithForm
        );
    },
    createBoardNameButtonGroup: function (boardId, boardName) {
        const btnBuilder = htmlFactory(htmlTemplates.button)
        const content = btnBuilder(buttonTypes.boardNameBtnGroup, 'secondary', 'board-name', boardId, boardName)
        domManager.insertFirstChild(`#board-${boardId}-container`, content)
        addBoardNameBtnGroupEventListeners(boardId)
    },
    createColumnNameButtonGroup: function (boardId, columnId, placeholder=false) {
        const btnBuilder = htmlFactory(htmlTemplates.button)
        const content = btnBuilder(buttonTypes.columnNameBtnGroup, 'btn-antracite', 'btn-size-medium',
                                   [boardId, columnId])
        domManager.insertFirstChild(`#board-${boardId}-column-${columnId}-container`, content)
        addColumnNameBtnGroupEventListeners(boardId, columnId);
        if (placeholder){
            setPlaceholderContent(content);
        }
    },
    createCardNameButtonGroup: function (boardId, columnId, cardId, placeholder=false) {
        const btnBuilder = htmlFactory(htmlTemplates.button)
        const content = btnBuilder(buttonTypes.cardNameBtnGroup, 'light', 'card-name', [boardId, columnId, cardId])
        domManager.addChild(`#board-${boardId}-column-${columnId}-card-${cardId}-container`, content)
        addCardNameBtnGroupEventListeners(boardId, columnId, cardId);
        if (placeholder){
            setPlaceholderContent(content);
        }
    }
};

function addBoardNameBtnGroupEventListeners(boardId){
    domManager.addEventListener(
        `#board-${boardId}-name`,
        "click",
        loadBoardDataToDOM
    );
    domManager.addEventListener(
        `#change-board-${boardId}-name`,
        "click",
        renameElement
    );
    domManager.addEventListener(
        `#delete-board-${boardId}-container`,
        "click",
        deleteElement
    );
}

function addColumnNameBtnGroupEventListeners(boardId, columnId){
    domManager.addEventListener(
        `#change-board-${boardId}-column-${columnId}-name`,
        "click",
        renameElement
    );
    domManager.addEventListener(
        `#delete-board-${boardId}-column-${columnId}-container`,
        "click",
        deleteElement
    );
}

function addCardNameBtnGroupEventListeners(boardId, columnId, cardId){
    domManager.addEventListener(
        `#change-board-${boardId}-column-${columnId}-card-${cardId}-name`,
        "click",
        renameElement
    );
    domManager.addEventListener(
        `#delete-board-${boardId}-column-${columnId}-card-${cardId}-container`,
        "click",
        deleteElement
    );
}

function setPlaceholderContent(content){
    const placeholderBuilder = htmlFactory(htmlTemplates.placeholder)
    domManager.addChild(`#${content.children[0].id}`, placeholderBuilder())
}

function renameElement(clickEvent) {
    const currentTarget = clickEvent.currentTarget
    const targetId = currentTarget.dataset.targetId
    const renamedElement = document.querySelector(`#${targetId}`)
    const currentName = renamedElement.innerHTML
    const renamedElementParent = renamedElement.parentElement.parentElement
    const elementType = renamedElement.dataset.elementType;

    renamedElementParent.removeChild(renamedElement.parentElement);
    if (elementType === "board-name") {
        formManager.createChangeBoardNameForm(currentName, elementType, renamedElementParent);
    } else if (elementType === "column-name") {
        formManager.createChangeColumnNameForm(currentName, elementType, renamedElementParent);
    } else if (elementType === "card-name") {
        formManager.createChangeCardNameForm(currentName, elementType, renamedElementParent);
    }
}

function deleteElement(clickEvent) {
    const targetId = clickEvent.currentTarget.dataset.targetId;
    const targetElement = document.querySelector(`#${targetId}`);
    const elementType = targetElement.dataset.elementType;
    const boardId = targetElement.dataset.boardId
    const columnId = targetElement.dataset.columnId
    const cardId = targetElement.dataset.cardId
    if (elementType === "board-container") {
        boardsManager.deleteBoard(boardId);
    } else if (elementType === "column-container") {
        columnsManager.deleteColumn(boardId, columnId);
    } else if (elementType === "card-container") {
        cardsManager.deleteCard(boardId, columnId, cardId);
    }
}
