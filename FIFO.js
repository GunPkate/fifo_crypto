const { readFileSync, promises: fsPromises } = require("fs");

function syncReadFile(filename) {
  const contents = readFileSync(filename, "utf-8");

  const arr = contents.split(/\r?\n/);
  let get_values = [];
  for (let i = 0; i < arr.length; i++) {
    // console.log(arr[i]);
    let value = arr[i].split(/[ ,]/);
    console.log(value);
    get_values.push(value);
  }
  // console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']

  return get_values;
}

// syncReadFile("./crypto.txt");

// let values = [
//   ["B", "BTC", 680000.0, 2.5],
//   ["B", "ETH", 43000.0, 12.0],
//   ["B", "BTC", 690000.0, 2.5],
//   ["S", "BTC", 695000.0, 3.0],
//   ["B", "ETH", 43500.0, 13.5],
//   ["S", "BTC", 695000.0, 1.0],
//   ["S", "ETH", 45000.0, 30.0],
// ];
let values = syncReadFile("./crypto.txt");

let btc = [];
let eth = [];

let settlePL = 0;
for (let i = 0; i < values.length; i++) {
  addData(values, i, btc, "BTC");
  addData(values, i, eth, "ETH");
  checkPL(values, i, btc, "BTC");
  // console.log(btc);
  checkPL(values, i, eth, "ETH");
  // console.log(eth);
}
function addData(values, i, setData, type) {
  if (values[i][0] === "B" && values[i][1] === type) {
    let data = [values[i][2], values[i][3]];
    setData.push(data);
  }
}

function checkPL(values, i, stock, type) {
  if (values[i][0] === "S" && values[i][1] === type) {
    let sellCoin = values[i][3];
    let sellPrice = values[i][2];

    let count = 0;
    for (let y = 0; y < stock.length; y++) {
      let buyPrice = stock[y][0];
      let settlePrice = sellPrice - buyPrice;
      let invCoin = stock[y][1];
      // if (y == 0) console.log(`sell start ${sellCoin}`);
      if (invCoin <= sellCoin) {
        // console.log(
        //   `#${y} stock ${stock[y][1]} sell Order ${invCoin} settlePrice ${settlePrice}`
        // );
        settlePL += settlePrice * invCoin;
        sellCoin -= invCoin;

        // console.log(`sellRemain ${sellCoin}`);
      } else if (invCoin > sellCoin) {
        // console.log(
        //   `#${y} stock ${stock[y][1]} sell Order ${sellCoin} settlePrice ${settlePrice}`
        // );
        settlePL += settlePrice * sellCoin;
        stock[y][1] -= sellCoin;
        sellCoin -= sellCoin;
      }
      // stock.shift(stock[y]);
      if (sellCoin == 0) stock.shift(stock[y]);
      // console.log(stock[y]);
      console.log(`${type} sellRemain ${sellCoin}  P/L${settlePL}`);
    }
  }
}
