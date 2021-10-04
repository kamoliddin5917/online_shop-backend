const path = require("path");
const IO = require("./io/io");

const getProducts = (args) => {
  const [pathName, productName] = args;

  const informationIo = new IO(path.resolve("../database", `${pathName}.json`));
  const products = informationIo.read();
  if (products.length) {
    const parseProducts = JSON.parse(products);
    if (parseProducts.length) {
      if (productName && pathName == "product") {
        const regExp = new RegExp(productName, "gi");
        const findProducts = parseProducts.filter((item) =>
          item.name.match(regExp)
        );
        findProducts.length
          ? console.table(findProducts)
          : console.log(`${productName} this product was not found`);
      } else if (productName) {
        const regExp = new RegExp(productName, "gi");
        const findProducts = parseProducts.filter((item) => item.match(regExp));
        findProducts.length
          ? console.table(findProducts)
          : console.log(`${productName} this product was not found`);
      } else {
        console.table(parseProducts);
      }
    } else {
      console.info(`There is nothing in the this base! - ${pathName}`);
    }
  } else {
    console.info(`There is nothing in the this base! - ${pathName}`);
  }
};

getProducts(process.argv.slice(2));
