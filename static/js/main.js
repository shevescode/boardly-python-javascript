import { boardsManager } from "./controller/boardsManager.js";
import { buttonsManager } from "./controller/buttonsManager.js";

function init() {
  buttonsManager.createAddBoardButton();
  boardsManager.loadBoards();
}

init();
