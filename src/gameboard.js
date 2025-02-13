import Ship from "./ship.js";

export default (function () {
  const ships = Array.from({ length: 10 }, () => Array(10).fill(0));
  const shot = Array.from({ length: 10 }, () => Array(10).fill(0));

  function validPlacement(length, direction, y, x) {
    if (direction == "vertical") {
      for (let i = 0; i < length; ++i) {
        if (y + i == 10 || ships[y + i][x] != 0) {
          return false;
        }
      }
    } else if (direction == "horizontal") {
      for (let i = 0; i < length; ++i) {
        if (x + i == 10 || ships[y][x + i] != 0) {
          return false;
        }
      }
    }

    return true;
  }

  function addShip(length, direction, y, x, shipGraphic) {
    if (x == -1 || y == -1 || !validPlacement(length, direction, y, x)) {
      return false;
    }
    let ship = Ship(length, shipGraphic);

    if (direction == "vertical") {
      for (let i = 0; i < length; ++i) {
        ships[y + i][x] = ship;
      }
    } else if (direction == "horizontal") {
      for (let i = 0; i < length; ++i) {
        ships[y][x + i] = ship;
      }
    }
    return true;
  }

  function removeShip(length, direction, y, x) {
    if (x == -1 || y == -1) return false;

    if (direction == "vertical") {
      for (let i = 0; i < length; ++i) {
        ships[y + i][x] = 0;
      }
    } else if (direction == "horizontal") {
      for (let i = 0; i < length; ++i) {
        ships[y][x + i] = 0;
      }
    }
    return true;
  }

  function receiveAttack(y, x) {
    if (shot[y][x] == 0) {
      shot[y][x] = 1;
      if (ships[y][x] != 0) {
        ships[y][x].hit();
        return [true, ships[y][x].isSunk() ? ships[y][x] : false, true];
      }
      return [false, false, true];
    }
    // hit, sunk, openToShoot
    return [false, false, false];
  }

  return { addShip, removeShip, receiveAttack };
});
