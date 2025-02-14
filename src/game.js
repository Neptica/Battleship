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
        let won = false;
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
              prevImg.classList.remove("turn");
              prevImg.classList.add("winner");
              won = true;
              msgContainer.innerHTML = `You've sunken all of ${playerNames[currentBoard]}'s ships, ${playerNames[oppositeBoard]}! <br> You've Won!`;
              setTimeout(() => {
                msgContainer.innerHTML = "";
                PubSub.publish("Gameover", prevImg);
                container.removeChild(blinder);
                return;
              }, 3000);
            }
          } else if (results[0]) {
            this.style.backgroundColor = "red";
            msgContainer.innerHTML = "You hit a battleship";
          } else {
            this.style.backgroundColor = "darkblue";
            msgContainer.innerHTML = "You missed";
          }

          if (!won) {
            setTimeout(() => {
              container.replaceChild(next, curr);
              const nextName = playerNames[currentBoard];
              const nextImg = playerImgs[currentBoard];
              const prevImg = playerImgs[oppositeBoard];
              const nImg = nextImg.firstElementChild;
              const pImg = prevImg.firstElementChild;
              nextImg.classList.add("turn");
              nextImg.style.transform = "scale(1.1)";
              prevImg.classList.remove("turn");
              prevImg.style.transform = "scale(1)";
              nImg.style.transform = "scale(1.1)";
              pImg.style.transform = "scale(1)";
              currentBoard = oppositeBoard;
              container.removeChild(blinder);
              msgContainer.innerHTML = `Bombs away, ${nextName}!`;
            }, 30);
          }
        } else {
          let currName = playerNames[(currentBoard + 1) % 2];
          msgContainer.innerHTML = `But ${currName}, we've already shot there`;
          setTimeout(() => {
            msgContainer.innerHTML = `Fire at an open square this time, ${currName}`;
            container.removeChild(blinder);
          }, 30);
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
    const sImg = startingImg.firstElementChild;
    startingImg.classList.add("turn");
    startingImg.style.transform = "scale(1.1)";
    sImg.style.transform = "scale(1.1)";
    msgContainer.textContent = `Fire away, ${startingName}`;
    return await waitForEvent("Gameover");
  }

  return { setup, play };
});
