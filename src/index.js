import MenuController from "./menu.js";
import PreGameController from "./pregame.js";
import "./css/style.css";

(async function () {
  const container = document.getElementById("body__container");
  const menuBoard = document.getElementById("main__menu");
  const msgContainer = document.getElementById("message__container");
  const boardTemplate = document.getElementById("board__container");
  const aside = document.getElementById("options__container");

  const playerBoardGUIs = initializeBoard(boardTemplate);

  const Menu = MenuController(menuBoard, msgContainer);
  const PreGame = PreGameController(msgContainer, aside);

  const players = await Menu.start();
  container.replaceChild(playerBoardGUIs[0], boardTemplate);
  const p1ships = await PreGame.createShips(players[0], playerBoardGUIs[0]);
  container.replaceChild(playerBoardGUIs[1], playerBoardGUIs[0]);
  const p2ships = await PreGame.createShips(players[1], playerBoardGUIs[1]);

  console.log("Ships Placed", p1ships, p2ships);
})();

function initializeBoard(grid) {
  for (let i = 0; i < 100; i++) {
    const item = document.createElement("div");
    item.classList.add("items");
    grid.appendChild(item);
  }

  const p1Board = grid.cloneNode(true);
  p1Board.id = grid.id;
  const p2Board = grid.cloneNode(true);
  p2Board.id = grid.id;

  return [p1Board, p2Board];
}
