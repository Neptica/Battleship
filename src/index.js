import Player from "./player.js";
import { shipGUI } from "./shipGUI.js";
import "./css/style.css";

(function () {
  const menu = document.getElementById("main__menu");
  const msgContainer = document.getElementById("message__container");

  const board = document.getElementById("board__container");
  initializeBoard(board);

  const aside = document.getElementById("options__container");

  const ships = initializeShips(board);
  ships.forEach(({ ship, freeze }) => aside.appendChild(ship));

  const button = document.getElementById("confirm");
  button.addEventListener("click", () => {
    const allPlaced = getShipPositions(board);
    if (allPlaced) {
      freezeShips(ships);
      msgContainer.removeChild(button);
    }
  });
  button.textContent = "Confirm Ship positions";
  button.style.height = "50px";
  button.style.width = "350px";
  msgContainer.appendChild(button);
})();

function getShipPositions(grid) {
  let shipCoords = [];
  const shipElements = grid.querySelectorAll(".items div");

  if (shipElements.length != 5) {
    return false;
  }

  const gridItems = grid.querySelectorAll(".items");
  for (let i = 0; i < shipElements.length; i++) {
    for (let j = 0; j < gridItems.length; j++) {
      if (gridItems[j] === shipElements[i].parentElement) {
        console.log(
          shipElements[i].dataset.rotation,
          Math.floor(j / 10),
          j % 10,
        );
        shipCoords.push([
          shipElements[i].dataset.rotation,
          Math.floor(j),
          j % 10,
        ]);
      }
    }
  }
  return true;
}

function initializeBoard(grid) {
  for (let i = 0; i < 100; i++) {
    const item = document.createElement("div");
    item.classList.add("items");
    grid.appendChild(item);
  }
}

function initializeShips(board) {
  let battleshipGUI = shipGUI();
  const ship = battleshipGUI.battleShip(document, board, 5);
  const ship1 = battleshipGUI.battleShip(document, board, 4);
  const ship2 = battleshipGUI.battleShip(document, board, 3);
  const ship3 = battleshipGUI.battleShip(document, board, 3);
  const ship4 = battleshipGUI.battleShip(document, board, 2);
  return [ship, ship1, ship2, ship3, ship4];
}

function freezeShips(ships) {
  ships.forEach(({ ship, freeze }) => freeze());
}
