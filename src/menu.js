import p1Image from "./images/p1.jpg";
import p2Image from "./images/p2.jpg";
import { PubSub, waitForEvent } from "./PubSub.js";

export default (function (menu, message) {
  let player1Input;
  let player2Input;

  let inputDiv;
  let inputDiv2;

  async function start() {
    menu.innerHTML = "";

    // Player 1
    const p1 = document.createElement("div");
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    inputDiv = document.createElement("div");
    const label = document.createElement("label");
    player1Input = document.createElement("input");

    imgContainer.classList.add("img__container");

    p1.classList.add("playerDiv");

    img.src = p1Image;
    img.classList.add("playerIcon");

    inputDiv.style.cssText = "height: 3rem;";

    label.setAttribute("for", "name1");
    label.textContent = "Player Name: ";
    player1Input.setAttribute("type", "text");
    player1Input.setAttribute("id", "name1");
    player1Input.classList.add("input");

    inputDiv.appendChild(label);
    inputDiv.appendChild(player1Input);
    imgContainer.appendChild(img);
    p1.appendChild(imgContainer);
    p1.appendChild(inputDiv);
    menu.appendChild(p1);

    // Player 2
    const p2 = document.createElement("div");
    const img2Container = document.createElement("div");
    const img2 = document.createElement("img");
    inputDiv2 = document.createElement("div");
    const label2 = document.createElement("label");
    player2Input = document.createElement("input");

    img2Container.classList.add("img__container");

    p2.classList.add("playerDiv");

    img2.src = p2Image;
    img2.classList.add("playerIcon");

    inputDiv2.style.cssText = "height: 3rem;";

    label2.setAttribute("for", "name1");
    label2.textContent = "Player Name: ";
    player2Input.setAttribute("type", "text");
    player2Input.setAttribute("id", "name2");
    player2Input.classList.add("input");

    inputDiv2.appendChild(label2);
    inputDiv2.appendChild(player2Input);
    img2Container.appendChild(img2);
    p2.appendChild(img2Container);
    p2.appendChild(inputDiv2);
    menu.appendChild(p2);

    const begin = document.createElement("button");
    begin.textContent = "Start Game";
    begin.style.cssText = "height: 50%; width: 50%;";
    begin.addEventListener("click", checkPlayersReady);
    message.appendChild(begin);
    return [
      await waitForEvent("Confirmed Selection"),
      [imgContainer, img2Container],
    ];
  }

  function checkPlayersReady() {
    const p1Name = player1Input.value;
    const p2Name = player2Input.value;
    if (p1Name && p2Name) {
      this.removeEventListener("click", checkPlayersReady);
      message.textContent = "Let's Play BattleShip!";

      inputDiv.textContent = p1Name;
      inputDiv.classList.add("playerTitles");

      inputDiv2.textContent = p2Name;
      inputDiv2.classList.add("playerTitles");
      setTimeout(() => {
        PubSub.publish("Confirmed Selection", [p1Name, p2Name]);
        message.innerHTML = "";
      }, 3);
    } else {
      const error = document.getElementById("errorMessage");
      if (!error) {
        const error = document.createElement("div");
        error.id = "errorMessage";
        error.textContent = "Please Enter Player Names";
        error.style.position = "absolute";
        error.style.fontSize = "1.5rem";
        error.style.bottom = "5px";
        error.style.color = "red";
        message.appendChild(error);
      }
    }
  }
  return { start };
});
