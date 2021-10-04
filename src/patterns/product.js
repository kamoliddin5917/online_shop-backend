class Product {
  id;
  name;
  author;
  image;
  price;
  count;
  constructor(name, author, price, image, count, id) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.image = image;
    this.price = price;
    this.count = count;
  }
}

module.exports = Product;
