import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";



export let columnManager = {
  loadColumns: async function (parent) {
    const columns = await dataHandler.getStatuses();
    for (let column of columns) {
      const columnBuilder = htmlFactory(htmlTemplates.column);
      const content = columnBuilder(column);
      domManager.addChild(`#collapse${parent.dataset.boardId}`, content);
      cardsManager.loadCards(`#collapse${parent.dataset.boardId}`)
    }

  },

};



// function deleteButtonHandler(clickEvent) {}