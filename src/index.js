import MenuController from "./menu.js";
import PreGameController from "./pregame.js";
import GameController from "./game.js";
import PlayAgain from "./playAgain.js";
import "./css/style.css";

(async function () {
  const container = document.getElementById("body__container");
  const menuBoard = document.getElementById("main__menu");
  const msgContainer = document.getElementById("message__container");
  const boardTemplate = document.getElementById("board__container");
  const aside = document.getElementById("options__container");
  const blinder = createBlinder(boardTemplate, container);
  container.append(blinder);

  let again = true;
  while (again) {
    const playerBoardGUIs = initializeBoard(boardTemplate);

    const Menu = MenuController(menuBoard, msgContainer);
    const PreGame = PreGameController(msgContainer, aside);

    const [players, playerImgs] = await Menu.start();
    playerImgs[0].classList.add("turn");
    container.replaceChild(playerBoardGUIs[0], boardTemplate);
    const p1ships = await PreGame.createShips(
      players[0],
      playerBoardGUIs[0],
      playerImgs[0],
    );
    container.replaceChild(playerBoardGUIs[1], playerBoardGUIs[0]);
    const p2ships = await PreGame.createShips(
      players[1],
      playerBoardGUIs[1],
      playerImgs[1],
    );

    const Game = GameController(
      [p1ships, p2ships],
      playerBoardGUIs,
      players,
      playerImgs,
      container,
      msgContainer,
    );

    Game.setup();
    const winnerImgContainer = await Game.play();

    again = await PlayAgain(
      msgContainer,
      winnerImgContainer,
      playerBoardGUIs,
      [playerImgs[0].firstChild, playerImgs[1].firstChild],
      container,
    );

    try {
      container.replaceChild(boardTemplate, playerBoardGUIs[0]);
    } catch (error) {
      container.replaceChild(boardTemplate, playerBoardGUIs[1]);
    }
    boardTemplate.style.zIndex = 15;

    menuBoard.innerHTML = "";
    msgContainer.innerHTML = "";
    boardTemplate.innerHTML = "";
    aside.innerHTML = "";
  }
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

function createBlinder() {
  const blinder = document.createElement("div");
  blinder.classList.add("block");
  return blinder;
}
