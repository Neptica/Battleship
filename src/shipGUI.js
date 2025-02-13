export { shipGUI };
function shipGUI() {
  function battleShip(keyGrabContainer, gameBoard, length, playerBoard) {
    const ship = document.createElement("div");
    let coordX;
    let coordY;
    let lastRotation;
    let lastX;
    let lastY;

    ship.classList.add("ships");
    ship.dataset.length = length;
    ship.dataset.rotation = "horizontal";
    ship.addEventListener("mouseup", move);

    // Box Setup
    let gap = 4;
    const tiles = document.getElementsByClassName("items");
    let locationStyle = tiles[0].getBoundingClientRect();
    ship.style.height = locationStyle.height - gap + "px";
    ship.style.width =
      locationStyle.height +
      (length - 1) * (locationStyle.height + gap) -
      gap +
      "px";

    function move() {
      ship.style.position = "fixed";
      ship.style.zIndex = "99";
      let oldBox = ship.getBoundingClientRect();
      if (coordX === undefined) {
        coordX = oldBox.x;
        coordY = oldBox.y;
      }

      ship.removeEventListener("mouseup", move);
      ship.addEventListener("mouseup", unSelect);
      keyGrabContainer.addEventListener("mousemove", drag);
      keyGrabContainer.addEventListener("keydown", rotate);
    }

    function rotate(event, skip = false) {
      // TODO: Add proper rotate that will deal well with battleship images
      if (skip || event.code == "KeyR") {
        let oldBox = ship.getBoundingClientRect();
        let newWidth = oldBox.height;
        let newHeight = oldBox.width;

        if (newWidth < newHeight) {
          ship.dataset.rotation = "vertical";
        } else {
          ship.dataset.rotation = "horizontal";
        }

        ship.style.height = newHeight + "px";
        ship.style.width = newWidth + "px";
      }
    }

    function drag(event) {
      const underMouse = document.elementsFromPoint(
        event.clientX,
        event.clientY,
      );
      let tile = -1;
      let grid = -1;
      for (let i = 0; i < underMouse.length; ++i) {
        if (underMouse[i].classList.contains("items")) {
          tile = underMouse[i];
        } else if (underMouse[i].id == gameBoard.id) {
          grid = underMouse[i];
        }
      }

      if (tile != -1) {
        let selected = tile.getBoundingClientRect();
        let boxStyle = ship.getBoundingClientRect();
        let padding;
        if (boxStyle.height < boxStyle.width) {
          padding = (selected.height - boxStyle.height) / 2;
        } else {
          padding = (selected.width - boxStyle.width) / 2;
        }
        let checkX = selected.x + padding;
        let checkY = selected.y + padding;
        ship.style.left = checkX + "px";
        ship.style.top = checkY + "px";
      } else if (grid == -1) {
        ship.style.left = event.clientX + "px";
        ship.style.top = event.clientY + "px";
      }
    }

    function unSelect(event) {
      ship.addEventListener("mouseup", move);
      ship.removeEventListener("mouseup", unSelect);
      keyGrabContainer.removeEventListener("mousemove", drag);
      keyGrabContainer.removeEventListener("keydown", rotate);
      ship.style.zIndex = "auto";

      const underMouse = document.elementsFromPoint(
        event.clientX,
        event.clientY,
      );
      let tile = -1;
      let shipBank = -1;
      for (let i = 0; i < underMouse.length; ++i) {
        if (underMouse[i].classList.contains("items")) {
          tile = underMouse[i];
        } else if (underMouse[i].id == "options__container") {
          shipBank = underMouse[i];
        }
      }

      const rot = ship.dataset.rotation;
      const len = ship.dataset.length;
      let x = -1;
      let y = -1;
      const gridItems = gameBoard.querySelectorAll(".items");
      for (let i = 0; i < gridItems.length; i++) {
        if (gridItems[i] == tile) {
          y = Math.floor(i / 10);
          x = i % 10;
          break;
        }
      }

      playerBoard.removeShip(length, lastRotation, lastY, lastX); // remove to check validity of placement
      const validPlacement = playerBoard.addShip(len, rot, y, x, ship);
      console.log(validPlacement);
      if (tile != -1 && validPlacement) {
        let boxStyle = ship.getBoundingClientRect();
        tile.appendChild(ship);
        ship.style.position = "absolute";
        coordX = boxStyle.x;
        coordY = boxStyle.y;

        lastRotation = rot;
        lastY = y;
        lastX = x;
      } else if (shipBank != -1) {
        shipBank.appendChild(ship);
        ship.style.position = "static";
        lastY = -1;
        lastX = -1;
      } else {
        if (ship.parentElement.id != "options__container") {
          playerBoard.addShip(length, lastRotation, lastY, lastX, ship); // replace removed ship
          if (lastRotation && lastRotation != ship.dataset.rotation) {
            rotate(undefined, true);
          }
          ship.style.left = coordX + "px";
          ship.style.top = coordY + "px";
          ship.style.position = "absolute";
        } else {
          ship.style.position = "static";
        }
      }
    }

    function freeze() {
      ship.removeEventListener("mouseup", move);
      keyGrabContainer.removeEventListener("mousemove", drag);
      keyGrabContainer.removeEventListener("keydown", rotate);
    }
    return { ship, freeze };
  }

  function adjustShips() {
    const tiles = document.getElementsByClassName("items");
    let locationStyle = tiles[0].getBoundingClientRect();
    const ships = document.getElementsByClassName("ships");

    let gap = 4;
    for (let i = 0; i < ships.length; i++) {
      // Resize
      if (ships[i].dataset.rotation == "horizontal") {
        ships[i].style.height = locationStyle.height - gap + "px";
        ships[i].style.width =
          locationStyle.height +
          (ships[i].dataset.length - 1) * (locationStyle.height + gap) -
          gap +
          "px";
      } else if (ships[i].dataset.rotation == "vertical") {
        ships[i].style.height =
          locationStyle.height +
          (ships[i].dataset.length - 1) * (locationStyle.height + gap) -
          gap +
          "px";
        ships[i].style.width = locationStyle.height - gap + "px";
      }

      // Reposition
      let selected = ships[i].parentElement.getBoundingClientRect();
      let boxStyle = ships[i].getBoundingClientRect();
      let padding;
      if (boxStyle.height < boxStyle.width) {
        padding = (selected.height - boxStyle.height) / 2;
      } else {
        padding = (selected.width - boxStyle.width) / 2;
      }
      let checkX = selected.x + padding;
      let checkY = selected.y + padding;
      ships[i].style.left = checkX + "px";
      ships[i].style.top = checkY + "px";
    }
  }

  window.addEventListener("resize", adjustShips);
  return { battleShip, adjustShips };
}
