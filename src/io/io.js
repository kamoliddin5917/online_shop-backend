const fs = require("fs");

class IO {
  constructor(dir) {
    this.dir = dir;
  }
  read() {
    return fs.readFileSync(this.dir, { encoding: "utf-8", flag: "r" });
  }
  write(data) {
    return fs.writeFileSync(this.dir, JSON.stringify(data, null, 4));
  }
}

module.exports = IO;
