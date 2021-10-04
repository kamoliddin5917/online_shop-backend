const path = require("path");
const Event = require("events");
const IO = require("./io/io");
const Time = require("./patterns/time");

const productIo = new IO(path.resolve("../database", "product.json"));
const editIo = new IO(path.resolve("../database", "edit.json"));
const ee = new Event();

ee.on("ERROR", (error) => {
  console.log(error);
});

const editProduct = (args) => {
  const [id, price] = args;
  if (!id || !price) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "edit.js editProduct()",
      message: "Invalid values!",
      status: 400,
    });
    return;
  } else if (isNaN(id) || isNaN(price)) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "edit.js editProduct()",
      message: `${id} or ${price} these aren't number!`,
      status: 400,
    });
    return;
  } else if (Number(id) < 0 || Number(price) < 0) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "edit.js editProduct()",
      message: `${id} < 0 or ${price} < 0!`,
      status: 400,
    });
    return;
  }

  const products = productIo.read();
  const edited = editIo.read();

  if (products.length) {
    const parseProducts = JSON.parse(products);
    if (parseProducts.length) {
      const findProduct = parseProducts.find((item) => item.id == id);
      if (findProduct) {
        if (findProduct.price != price) {
          findProduct.price = price;
          productIo.write(parseProducts);

          if (edited.length) {
            const parseEdited = JSON.parse(edited);
            editIo.write([
              ...parseEdited,
              `The price of the ${
                findProduct.name
              } book has changed to ${price} ${Time()}`,
            ]);
          } else {
            editIo.write([
              `The price of the ${
                findProduct.name
              } book has changed to ${price} ${Time()}`,
            ]);
          }
        } else {
          ee.emit("ERROR", {
            time: new Date(),
            located: "edit.js editProduct()",
            message: `The price you entered is the same as the previous price!`,
            status: 400,
          });
          return;
        }
      } else {
        ee.emit("ERROR", {
          time: new Date(),
          located: "edit.js editProduct()",
          message: `${id} this digital book was not found!`,
          status: 400,
        });
        return;
      }
    } else {
      ee.emit("ERROR", {
        time: new Date(),
        located: "edit.js editProduct()",
        message: "No books!",
        status: 500,
      });
      return;
    }
  } else {
    ee.emit("ERROR", {
      time: new Date(),
      located: "edit.js editProduct()",
      message: "No books!",
      status: 500,
    });
    return;
  }
};
editProduct(process.argv.slice(2));
