import { shipGUI } from "./shipGUI.js";
import { PubSub, waitForEvent } from "./PubSub.js";

export default (function (msgContainer, aside) {
  async function createShips(player, board) {
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
      const shipBitmap = getShipPositions(board);
      console.log(shipBitmap);
      if (shipBitmap) {
        freezeShips(ships);
        msgContainer.innerHTML = "";
        PubSub.publish("All Ships Placed", shipBitmap);
      } else {
        instruction.textContent = `I'm not accepting this garbage, ${player}`;
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

  function getShipPositions(grid) {
    const shipElements = grid.querySelectorAll(".items div");
    if (shipElements.length != 5) {
      console.log("Here");
      return false;
    }

    let shipBitmap = Array.from({ length: 10 }, () => Array(10).fill(0));
    console.log(shipBitmap, "START");

    const gridItems = grid.querySelectorAll(".items");
    for (let i = 0; i < shipElements.length; i++) {
      for (let j = 0; j < gridItems.length; j++) {
        if (gridItems[j] === shipElements[i].parentElement) {
          const rot = shipElements[i].dataset.rotation;
          const len = shipElements[i].dataset.length;
          let y = Math.floor(j / 10);
          let x = j % 10;
          console.log("Coords", y, x);
          if (rot == "horizontal" && x + len - 1 < 10) {
            for (let k = 0; k < len; k++) {
              if (shipBitmap[y][x + k] == 0) {
                shipBitmap[y][x + k] = 1;
              } else {
                return false;
              }
            }
          } else if (y + len - 1 < 10) {
            for (let k = 0; k < len; k++) {
              if (shipBitmap[y + k][x] == 0) {
                shipBitmap[y + k][x] = 1;
              } else {
                return false;
              }
            }
          } else {
            return false;
          }
        }
      }
    }
    return shipBitmap;
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
