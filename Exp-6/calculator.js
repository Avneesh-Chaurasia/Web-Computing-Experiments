// Node.js Calculator using Command Line Input

const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=== Simple Node.js Calculator ===");
console.log("Operations: add, sub, mul, div");

// Ask user for input
rl.question("Enter first number: ", (num1) => {
  rl.question("Enter second number: ", (num2) => {
    rl.question("Enter operation (add/sub/mul/div): ", (operation) => {
      let a = parseFloat(num1);
      let b = parseFloat(num2);
      let result;

      switch (operation.toLowerCase()) {
        case "add":
          result = a + b;
          break;
        case "sub":
          result = a - b;
          break;
        case "mul":
          result = a * b;
          break;
        case "div":
          result = b !== 0 ? a / b : "Error! Division by zero.";
          break;
        default:
          result = "Invalid operation!";
      }

      console.log(`Result: ${result}`);
      rl.close();
    });
  });
});
