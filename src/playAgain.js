import { PubSub, waitForEvent } from "./PubSub.js";
export default (async function (
  msgBoard,
  winnerHighlight,
  boards,
  playerImgs,
  container,
) {
  let current;
  let borderStyle = "2px solid black";
  if (playerImgs[0].parentNode.classList.contains("winner")) {
    current = 1;
    playerImgs[1].style.border = borderStyle;
  } else {
    current = 0;
    playerImgs[0].style.border = borderStyle;
  }

  const header = document.createElement("h1");
  const button = document.createElement("button");
  header.textContent = "Would you like to play another game?";
  button.textContent = "Play Again";
  button.style.height = "50px";
  button.style.width = "350px";
  msgBoard.appendChild(header);
  msgBoard.appendChild(button);

  button.addEventListener("click", () => {
    winnerHighlight.classList.remove("winner");
    PubSub.publish("Play Again", true);
  });

  for (let board of boards) {
    const ships = board.getElementsByClassName("ships");
    for (let ship of ships) {
      ship.style.display = "block";
    }
  }

  for (let pImg of playerImgs) {
    pImg.addEventListener("mouseup", switchActiveBoard);
  }
  return await waitForEvent("Play Again");

  function switchActiveBoard() {
    if (this !== playerImgs[current]) {
      let next = (current + 1) % 2;
      playerImgs[current].style.border = "";
      playerImgs[next].style.border = borderStyle;
      container.replaceChild(boards[next], boards[current]);
      current = next;
    }
  }
});
