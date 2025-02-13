import MenuController from "./menu.js";
import PreGameController from "./pregame.js";
import "./css/style.css";

(async function () {
  const container = document.getElementById("body__container");
  const menuBoard = document.getElementById("main__menu");
  const msgContainer = document.getElementById("message__container");
  const board = document.getElementById("board__container");
  const aside = document.getElementById("options__container");

  const playerBoards = initializeBoard(board);

  const Menu = MenuController(menuBoard, msgContainer);
  const PreGame = PreGameController(p1Board, msgContainer, aside);

  const players = await Menu.start();
  const p1ships = await PreGame.createShips(players[0]);
  container.replaceChild(playerBoards[1], playerBoards[0]);
  const p2ships = await PreGame.createShips(players[1]);
  console.log("Ships Placed");
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
