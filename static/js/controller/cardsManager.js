import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates, cardTypes } from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";
import {buttonsManager} from "./buttonsManager.js";

export let cardsManager = {
  loadCard: function (cardId, columnId, boardId, cardTitle, cardsContainer, selectedMode, position) {
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const loadedCard = cardBuilder(cardTypes.loadedCard, cardId, columnId, boardId, cardTitle);
    if (selectedMode === mode.appendLast) {
      cardsContainer.appendChild(loadedCard);
    } else if (selectedMode === mode.insertAtPosition) {
      cardsContainer.insertBefore(loadedCard, cardsContainer.children[position]);
    } else if (selectedMode === mode.insertBeforeLast){
      cardsContainer.insertBefore(loadedCard, cardsContainer.children[cardsContainer.children.length - 1]);
    }
    // domManager.addEventListener(
    //   `.card[data-card-id="${card.id}"]`,
    //   "click",
    //   deleteButtonHandler
    // );
  },
  createNewCard: async function (title, formContainer, cardContainer) {
    const boardId = cardContainer.parentElement.dataset.boardId
    const columnId = cardContainer.parentElement.dataset.columnId
    const payload = {'title': title, 'board_id': boardId, 'column_id': columnId}
    const boardData = await dataHandler.createNewCard(payload);
    console.log(cardContainer)
    console.log(formContainer)
    cardContainer.parentElement.removeChild(formContainer);
    buttonsManager.createAddCardButton(boardId, columnId)
    if (boardData === 'error') {
        return;
    }
    this.loadCard(boardData.id, columnId, boardId, boardData.title, cardContainer, mode.appendLast)
    }
};

function deleteButtonHandler(clickEvent) {}
