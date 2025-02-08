import Ship from "../ship.js";
import Gameboard from "../gameboard.js";

test("Hitting The Ship", () => {
  let demo = Ship(5);
  demo.hit();
  expect(demo.isSunk()).toEqual(false);
  demo.hit();
  expect(demo.isSunk()).toEqual(false);
  demo.hit();
  expect(demo.isSunk()).toEqual(false);
  demo.hit();
  expect(demo.isSunk()).toEqual(false);
  demo.hit();
  expect(demo.isSunk()).toEqual(true);
});

test("Placing Ships", () => {
  let board = Gameboard();
  expect(board.addShip(5, "vertical", 1, 1)).toEqual(true);
  expect(board.addShip(5, "vertical", 1, 2)).toEqual(true);
  expect(board.addShip(5, "vertical", 1, 3)).toEqual(true);
  expect(board.addShip(5, "vertical", 1, 4)).toEqual(true);
  expect(board.addShip(5, "vertical", 1, 5)).toEqual(true);
  expect(board.addShip(5, "vertical", 1, 6)).toEqual(true);
  expect(board.addShip(5, "vertical", 1, 7)).toEqual(true);

  expect(board.addShip(5, "horizontal", 1, 1)).toEqual(false);
  expect(board.addShip(5, "horizontal", 2, 2)).toEqual(false);
  expect(board.addShip(5, "horizontal", 3, 3)).toEqual(false);
  expect(board.addShip(5, "horizontal", 3, 0)).toEqual(false);
});

test("Shot At", () => {
  let board = Gameboard();
  board.addShip(5, "vertical", 1, 1);
  expect(board.receiveAttack(1, 1)).toEqual(true);
  expect(board.receiveAttack(2, 1)).toEqual(true);
  expect(board.receiveAttack(3, 1)).toEqual(true);
  expect(board.receiveAttack(4, 1)).toEqual(true);
  expect(board.receiveAttack(5, 1)).toEqual(true);

  expect(board.receiveAttack(0, 3)).toEqual(false);
  expect(board.receiveAttack(3, 5)).toEqual(false);
  expect(board.receiveAttack(4, 8)).toEqual(false);
  expect(board.receiveAttack(5, 8)).toEqual(false);
  expect(board.receiveAttack(8, 9)).toEqual(false);
});
