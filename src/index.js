import MenuController from "./menu.js";
import "./css/style.css";

(function () {
  const menuBoard = document.getElementById("main__menu");
  const msgContainer = document.getElementById("message__container");
  const board = document.getElementById("board__container");
  // const aside = document.getElementById("options__container");
  initializeBoard(board);

  const Menu = MenuController(menuBoard, msgContainer);
  Menu.start();
})();

function initializeBoard(grid) {
  for (let i = 0; i < 100; i++) {
    const item = document.createElement("div");
    item.classList.add("items");
    grid.appendChild(item);
  }
}
