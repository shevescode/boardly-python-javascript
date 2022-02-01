import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates, cardTypes } from "../view/htmlFactory.js";
import {domManager, mode} from "../view/domManager.js";

export let cardsManager = {
  loadCard: async function (cardId, columnId, boardId, cardTitle, cardsContainer, selectedMode, position) {
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const loadedCard = cardBuilder(cardTypes.loadedCard, cardId, columnId, boardId, cardTitle);
    if (selectedMode === mode.appendLast) {
      cardsContainer.appendChild(loadedCard);
    } else if (selectedMode === mode.insertAtPosition) {
      cardsContainer.insertBefore(loadedCard, cardsContainer.children[position]);
    }
    // domManager.addEventListener(
    //   `.card[data-card-id="${card.id}"]`,
    //   "click",
    //   deleteButtonHandler
    // );
  },
};

function deleteButtonHandler(clickEvent) {}
