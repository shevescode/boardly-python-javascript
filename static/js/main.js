import { boardsManager } from "./controller/boardsManager.js";
import { addBoardBtnManager } from "./controller/addBoardBtnManager.js";

function init() {
  addBoardBtnManager.createAddBoardButton();
  boardsManager.loadBoards();
}

init();
