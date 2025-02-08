export default (function (length) {
  let shipLength = length;
  let hits = 0;

  function hit() {
    hits += 1;
  }

  function isSunk() {
    if (hits == shipLength) {
      return true;
    }
    return false;
  }

  return { hit, isSunk };
});
