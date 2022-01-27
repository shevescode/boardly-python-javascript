// import {dataHandler} from "../data/dataHandler";
// import {htmlFactory, htmlTemplates} from "../view/htmlFactory";
// import {domManager} from "../view/domManager";
//
//
// export let columnManager = {
//   loadColumns: async function (parent) {
//     const columns = await dataHandler.getStatuses();
//     for (let column of columns) {
//       const columnBuilder = htmlFactory(htmlTemplates.column);
//       const content = columnBuilder(column)
//       domManager.addChild(`#collapse${parent.dataset.boardId}`, content);
//       domManager.addEventListener(
//         `.card[data-column-id="${column.id}"]`,
//         "click",
//         deleteButtonHandler
//       );
//     }
//   },
//
// };
//
// function deleteButtonHandler(clickEvent) {}