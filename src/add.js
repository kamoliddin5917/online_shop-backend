const path = require("path");
const Event = require("events");
const IO = require("./io/io");
const Product = require("./patterns/product");
const Time = require("./patterns/time");

const productIo = new IO(path.resolve("../database", "product.json"));
const addIo = new IO(path.resolve("../database", "add.json"));
const ee = new Event();

ee.on("ERROR", (error) => {
  console.error(error);
});

const addProduct = function (args) {
  const [name, author, image, price, count] = args;
  let parseCount = 1;
  if (!name || !author || !price || !image) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "add.js addProduct()",
      message: "Invalid values!",
      status: 400,
    });
    return;
  } else if ((count && isNaN(count)) || isNaN(price)) {
    console.log(count);
    ee.emit("ERROR", {
      time: new Date(),
      located: "add.js addProduct()",
      message: `${count} or ${price} these aren't number!`,
      status: 400,
    });
    return;
  } else if ((count && Number(count) < 1) || Number(price) < 0) {
    ee.emit("ERROR", {
      time: new Date(),
      located: "add.js addProduct()",
      message: `${count} < 1 or ${price} < 0`,
      status: 400,
    });
    return;
  } else if (count) {
    parseCount = count - 0;
  }

  const products = productIo.read();
  const added = addIo.read();

  let id;
  if (products.length) {
    const parseProducts = JSON.parse(products);
    if (parseProducts.length) {
      id = parseProducts[parseProducts.length - 1].id + 1;
    } else id = 0;
  } else id = 0;
  const newProduct = new Product(name, author, price, image, parseCount, id);

  if (!products.length) {
    productIo.write([newProduct]);
    if (!added.length) {
      addIo.write([
        `${parseCount} of the ${name} books written by ${author} have been added at ${Time()}`,
      ]);
    } else {
      const oldadded = JSON.parse(added);
      addIo.write([
        ...oldadded,
        `${parseCount} of the ${name} books written by ${author} have been added at ${Time()}`,
      ]);
    }
  } else {
    const oldProduct = JSON.parse(products);
    const findProduct = oldProduct.find(
      (item) =>
        item.name == name &&
        item.author == author &&
        item.price == price &&
        item.image == image
    );
    if (findProduct) {
      findProduct.count += parseCount;
      productIo.write(oldProduct);
      if (!added.length) {
        addIo.write([
          `Again ${parseCount} of the ${name} books written by ${author} have been added, there are ${
            findProduct.count
          } at ${Time()}`,
        ]);
      } else {
        const oldadded = JSON.parse(added);
        addIo.write([
          ...oldadded,
          `${parseCount} of the ${name} books written by ${author} have been added, there are ${
            findProduct.count
          } at ${Time()}`,
        ]);
      }
    } else {
      productIo.write([...oldProduct, newProduct]);
      if (!added.length) {
        addIo.write([
          `${parseCount} of the ${name} books written by ${author} have been added at ${Time()}`,
        ]);
      } else {
        const oldadded = JSON.parse(added);
        addIo.write([
          ...oldadded,
          `${parseCount} of the ${name} books written by ${author} have been added at ${Time()}`,
        ]);
      }
    }
  }
};

addProduct(process.argv.slice(2));
