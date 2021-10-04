const path = require("path");
const Event = require("events");
const IO = require("./io/io");
const Time = require("./patterns/time");

const productIo = new IO(path.resolve("../database", "product.json"));
const sellIo = new IO(path.resolve("../database", "sell.json"));
const ee = new Event();

ee.on("ERROR", (error) => {
  console.error(error);
});

const sellProduct = (args) => {
  const [id, count] = args;

  if (!id || !count) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "sell.js sellProduct()",
      message: "Invalid values!",
      status: 400,
    });
    return;
  } else if ((count !== "all" && isNaN(count)) || isNaN(id)) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "sell.js sellProduct()",
      message: `${count} or ${id} these aren't number!`,
      status: 400,
    });
    return;
  } else if ((count !== "all" && Number(count) < 1) || Number(id) < 0) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "sell.js sellProduct()",
      message: `${count} < 1 or ${id} < 0`,
      status: 400,
    });
    return;
  }

  const products = productIo.read();
  const sold = sellIo.read();

  if (!products.length) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "sell.js sellProduct()",
      message: "No books!",
      status: 500,
    });
  } else {
    const oldProducts = JSON.parse(products);
    const findProduct = oldProducts.find((item) => item.id == id);
    if (!findProduct) {
      ee.emit("ERROR", {
        time: new Date(),
        located: "sell.js sellProduct()",
        message: `${id} this digital book was not found!`,
        status: 400,
      });
    } else {
      if (findProduct.count < count) {
        ee.emit("ERROR", {
          time: new Date(),
          located: "sell.js sellProduct()",
          message: `There are ${findProduct.count} from the ${findProduct.name} book, you can’t sell ${count}`,
        });
      } else if (findProduct.count == count || count == "all") {
        oldProducts.splice(oldProducts.indexOf(findProduct), 1);
        productIo.write(oldProducts);

        if (!sold.length) {
          sellIo.write([
            `${count} of ${findProduct.name} sells, ${
              findProduct.name
            } in the shop are now end! ${Time()}`,
          ]);
        } else {
          const oldSold = JSON.parse(sold);
          sellIo.write([
            ...oldSold,
            `${count} of ${findProduct.name} sells, ${
              findProduct.name
            } in the shop are now end! ${Time()}`,
          ]);
        }
      } else {
        findProduct.count -= Number(count);
        productIo.write(oldProducts);
        if (!sold.length) {
          sellIo.write([
            `${count} of ${findProduct.name} sells, there are ${
              findProduct.count
            } of ${findProduct.name} in the shop! ${Time()}`,
          ]);
        } else {
          const oldSold = JSON.parse(sold);
          sellIo.write([
            ...oldSold,
            `${count} of ${findProduct.name} sells, there are ${
              findProduct.count
            } of ${findProduct.name} in the shop! ${Time()}`,
          ]);
        }
      }
    }
  }
};

sellProduct(process.argv.slice(2));
