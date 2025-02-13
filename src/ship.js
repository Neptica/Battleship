export default (function (length, graphic) {
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

  function getGraphic() {
    return graphic;
  }

  return { hit, isSunk, getGraphic };
});
