import { PubSub, waitForEvent } from "./PubSub.js";
export default (function (
  playerBoards,
  boardGUIs,
  playerNames,
  playerImgs,
  container,
  msgContainer,
  blinder,
) {
  let currentBoard = 1;
  let sunkenShips = [0, 0];

  function setup() {
    for (let GUIBoard of boardGUIs) {
      const ships = GUIBoard.querySelectorAll(".items div");
      for (let ship of ships) {
        ship.style.display = "none";
      }

      const tiles = GUIBoard.querySelectorAll(".items");
      for (let tile of tiles) {
        tile.addEventListener("mouseup", shoot);
      }
    }
  }

  function shoot() {
    container.append(blinder);
    const tileContainer = this.parentNode;
    const tiles = tileContainer.querySelectorAll(".items");
    for (let i = 0; i < tiles.length; ++i) {
      if (tiles[i] === this) {
        const x = i % 10;
        const y = Math.floor(i / 10);
        let results = playerBoards[currentBoard].receiveAttack(y, x);
        if (results[2]) {
          let oppositeBoard = (currentBoard + 1) % 2;
          const next = boardGUIs[oppositeBoard];
          const curr = boardGUIs[currentBoard];
          if (results[1]) {
            this.style.backgroundColor = "red";
            msgContainer.innerHTML = "You sunk a battleship!";
            const ship = results[1].getGraphic();
            ship.style.display = "block";
            sunkenShips[oppositeBoard] += 1;
            if (sunkenShips[oppositeBoard] == 5) {
              const prevImg = playerImgs[oppositeBoard];
              prevImg.classList.remove("active__turn");
              prevImg.classList.add("game__winner");
              setTimeout(() => {
                msgContainer.innerHTML = `You've sunken all of ${playerNames[currentBoard]}, ${playerNames[oppositeBoard]}! <br> You've Won!`;
                PubSub.publish("Gameover", prevImg);
                container.removeChild(blinder);
              }, 3000);
            }
          } else if (results[0]) {
            this.style.backgroundColor = "red";
            msgContainer.innerHTML = "You hit a battleship";
          } else {
            this.style.backgroundColor = "darkblue";
            msgContainer.innerHTML = "You missed";
          }
          setTimeout(() => {
            container.replaceChild(next, curr);
            const nextName = playerNames[currentBoard];
            const nextImg = playerImgs[currentBoard];
            const prevImg = playerImgs[oppositeBoard];
            msgContainer.innerHTML = `Bombs away, ${nextName}!`;
            nextImg.classList.add("active__turn");
            prevImg.classList.remove("active__turn");
            currentBoard = oppositeBoard;
            container.removeChild(blinder);
          }, 3000);
        } else {
          let currName = playerNames[(currentBoard + 1) % 2];
          msgContainer.innerHTML = `But ${currName}, we've already shot there`;
          setTimeout(() => {
            msgContainer.innerHTML = `Fire at an open square this time, ${currName}`;
            container.removeChild(blinder);
          }, 3000);
        }
        // WHY DOESN'T THE BELOW WORK??
        // setTimeout(
        //   () =>
        //     container.replaceChild(
        //       boardGUIs[nextBoard],
        //       boardGUIs[currentBoard],
        //     ),
        //   5,
        // );
      }
    }
  }

  async function play() {
    let startingName = playerNames[(currentBoard + 1) % 2];
    const startingImg = playerImgs[(currentBoard + 1) % 2];
    msgContainer.textContent = `Fire away, ${startingName}`;
    startingImg.classList.add("active__turn");
    return await waitForEvent("Gameover");
  }

  return { setup, play };
});
