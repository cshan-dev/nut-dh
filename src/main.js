class Test {};
let a = 1,
 	b = 2,
 	foo = {
     	a, b
    },
 	sum = () => {
     	return a + b;
    };

console.log(sum());
console.log("I'm syncing ES6!");

export default a;
