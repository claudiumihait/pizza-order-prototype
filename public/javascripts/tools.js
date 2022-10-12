const readFile = require("./fileReader.js");
const writeFile = require("./fileWriter.js");

function assignID(obj) {
  let usedIDs = [];
  obj.orders.forEach((order) => usedIDs.push(order.id));
  const ID = usedIDs
    .map((_, i, arr) => (!arr.slice(0, i).includes(i + 1) ? i + 1 : null))
    .find((id) => !usedIDs.includes(id));

  return ID;
}

module.exports = {
  readFile,
  writeFile, 
  assignID,
};
