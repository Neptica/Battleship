import Ship from "./ship.js";

export default (function (size = 10) {
  const ships = Array.from({ length: 10 }, () => Array(10).fill(0));

  function validPlacement(length, direction, y, x) {
    if (direction == "vertical") {
      for (let i = 0; i < length; ++i) {
        if (y + i < length && ships[y + i][x] != 0) {
          return false;
        }
      }
    } else if (direction == "horizontal") {
      for (let i = 0; i < length; ++i) {
        if (x + i < length && ships[y][x + i] != 0) {
          return false;
        }
      }
    }

    return true;
  }

  function addShip(length, direction, y, x) {
    if (!validPlacement(length, direction, y, x)) {
      return false;
    }
    let ship = Ship(length);

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

  function receiveAttack(y, x) {
    if (ships[y][x] != 0) {
      ships[y][x].hit();
      return true;
    }
    return false;
  }

  return { addShip, receiveAttack };
});
