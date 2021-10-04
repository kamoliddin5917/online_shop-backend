const chalk = require("chalk");
console.log(chalk.cyan("Welcom to my shop!"));

const helpFn = () => `
                                  ${chalk.red("FIRST STEP!")}
${chalk.yellow("cd src")}   ---   Entrance to SRC file

                                  ${chalk.red("SECOND STEP!")}
${chalk.yellow(
  "node add (name) (author) (image) (price) (count)"
)}   ---   The book is added to the shop - ${chalk.green("(count - optional)")}
${chalk.yellow(
  "node sell id count"
)}                                 ---   The book is sold from the shop 
${chalk.yellow(
  "node sell id all"
)}                                   ---   This book is all sold from the store
${chalk.yellow(
  "node edit id price"
)}                                 ---   The book a price is edited from the shop
${chalk.yellow(
  "node get product (name)"
)}                            ---   Shop list - ${chalk.green(
  "(name - optional)"
)}
${chalk.yellow(
  "node get add (letters)"
)}                             ---   List of books added - ${chalk.green(
  "(letters - optional)"
)}
${chalk.yellow(
  "node get sell (letters)"
)}                            ---   List of books sold - ${chalk.green(
  "(letters - optional)"
)}
`;
console.log(helpFn());
