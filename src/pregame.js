import { shipGUI } from "./shipGUI.js";
import GameBoard from "./gameboard.js";
import { PubSub, waitForEvent } from "./PubSub.js";

export default (function (msgContainer, aside) {
  async function createShips(player, boardGUI, imgContainer) {
    imgContainer.classList.add("turn");
    const img = imgContainer.firstElementChild;
    imgContainer.style.transform = "scale(1.1)";
    img.style.transform = "scale(1.1)";
    let playerBoard = GameBoard();
    const ships = initializeShips(boardGUI, playerBoard);
    ships.forEach(({ ship, freeze }) => aside.appendChild(ship));

    const div = document.createElement("div");
    div.style.cssText =
      "display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 10px;";

    const instruction = document.createElement("p");
    instruction.textContent = `${player}, prepare your ships for battle!`;
    instruction.style.fontSize = "2rem";

    const button = document.createElement("button");
    button.classList.add("confirm");
    button.addEventListener("click", () => {
      const shipBitmap = checkAllShipsPlaced(boardGUI);
      if (shipBitmap) {
        freezeShips(ships);
        msgContainer.innerHTML = "";
        imgContainer.classList.remove("turn");
        imgContainer.style.transform = "scale(1)";
        img.style.transform = "scale(1)";
        PubSub.publish("All Ships Placed", playerBoard);
      } else {
        instruction.textContent = `Please place all of your battleships, ${player}`;
      }
    });
    button.textContent = "Confirm Ship Positions";
    button.style.height = "50px";
    button.style.width = "350px";
    div.appendChild(instruction);
    div.appendChild(button);
    msgContainer.appendChild(div);
    return await waitForEvent("All Ships Placed");
  }

  function checkAllShipsPlaced(grid) {
    const shipElements = grid.querySelectorAll(".items div");
    if (shipElements.length != 5) {
      console.log("Here");
      return false;
    }
    return true;
  }

  function initializeShips(board, playerBoard) {
    let battleshipGUI = shipGUI();
    const ship = battleshipGUI.battleShip(document, board, 5, playerBoard);
    const ship1 = battleshipGUI.battleShip(document, board, 4, playerBoard);
    const ship2 = battleshipGUI.battleShip(document, board, 3, playerBoard);
    const ship3 = battleshipGUI.battleShip(document, board, 3, playerBoard);
    const ship4 = battleshipGUI.battleShip(document, board, 2, playerBoard);
    return [ship, ship1, ship2, ship3, ship4];
  }

  function freezeShips(ships) {
    ships.forEach(({ ship, freeze }) => freeze());
  }

  return { createShips };
});
