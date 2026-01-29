// function sum (...args){
//     let sum = 0;
//     for(let arg of args){
//         sum += args;
//     }
//     return sum;
// }


// let x = sum(1,2,2,3,4,5,6,6,34,2,21,2,34)

// console.log(x);

// calculator in JS using arrow and terniary operators.

const calculator = (a, b, operation) => 
    operation === '+' ? a + b :
    operation === '-' ? a - b :
    operation === '*' ? a * b :
    operation === '/' ? a / b :
    'Invalid operation';

console.log(calculator(10, 5, '+')); 
console.log(calculator(10, 5, '-')); 
console.log(calculator(10, 5, '*')); 
console.log(calculator(10, 5, '/')); 

const initials = {
    name: "Tushar",
    eyeColor: " dark brown",
    height: 6

};

console.log(initials);
