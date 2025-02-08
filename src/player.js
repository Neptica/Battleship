import Gameboard from "./gameboard.js";

export default (function () {
  let board = Gameboard();
  let sunkShips = 0;

  function incSunk() {
    sunkShips += 1;
  }

  function checkLoss() {
    return sunkShips == 5;
  }

  return { board, incSunk, checkLoss };
});
