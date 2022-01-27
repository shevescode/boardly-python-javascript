import { boardsManager } from "./controller/boardsManager.js";
import { buttonManager } from "./controller/buttonManager.js";

function init() {
  //buttonManager.createAddBoardButton();
  boardsManager.loadBoards();
}

init();
