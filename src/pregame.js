import { shipGUI } from "./shipGUI.js";
import { PubSub, waitForEvent } from "./PubSub.js";

export default (function (board, msgContainer, aside) {
  // const menuBoard = document.getElementById("main__menu");
  // const msgContainer = document.getElementById("message__container");
  // const board = document.getElementById("board__container");
  // const aside = document.getElementById("options__container");

  async function createShips(player) {
    const ships = initializeShips(board);
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
      const allPlaced = getShipPositions(board);
      if (allPlaced) {
        freezeShips(ships);
        msgContainer.innerHTML = "";
        PubSub.publish("All Ships Placed");
      }
    });
    button.textContent = "Confirm Ship Positions";
    button.style.height = "50px";
    button.style.width = "350px";
    div.appendChild(instruction);
    div.appendChild(button);
    msgContainer.appendChild(div);
    await waitForEvent("All Ships Placed");
    return ships;
  }

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

  return { createShips };
});
