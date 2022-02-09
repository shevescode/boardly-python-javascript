import { boardsManager } from "./controller/boardsManager.js";
import { buttonsManager } from "./controller/buttonsManager.js";

// const timerInterval = setInterval(boardsManager.loadBoardContent, 1000);

function init() {
  buttonsManager.createAddBoardButton();
  boardsManager.loadBoards();
}

init();
