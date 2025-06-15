/*
    I'm finally on an academic break, that means it's time to actually learn something real.
    Before the vacation ends, I hope I can finish 'Everything You Need to Ace Pre-Algebra & Algebra-1 in One Big Fat Notebook.
    I will implement what I learn so it'll stick to my little brain.    
*/

// console.log(`
//     Unit [1][1] Types of Numbers

//     - Natural numbers or counting numbers is a set of positive numbers [1, 2, 3, ...]
//       A natural number or a counting number can be anything between 1 and +Infinity
//         a. Is 0 a positive or a negative number? It is unsigned according to discussions online.

//     - Whole numbers is a set of positive numbers (like natural numbers) but with 0 [0, 1, 2, ...]

//     - Integers is a set of of whole numbers but with negative natural numbers [..., -1, 0, 1, ...]

//     - Rational numbers are numbers that can be represented by dividing an integer by another (you cannot have 0 as denominator).
//       They are also known as fraction or ratio. For example 0.5 is equal 1/2, or 0.33333...(repeating decimal) is equal 1/3.
//       Natural numbers, whole numbers, and integers are all rational numbers.

//     - Irrational numbers are numbers that cannot be represented by dividing an integer by another.
//       Math.sqrt(5) -> ${Math.sqrt(5)} is an irrational number because its digits is non-repeating unlike Math.sqrt(4) -> ${Math.sqrt(4)}.

//     - Real numbers are set of all numbers on a number line.

//     - The object looks like
//     - real: {
//         irrational: {
//           example: [0.32497..., 1/2, 0, 1, 2e9]
//         },
//         rational: {
//           example: [2/10, 1.5, -8]
//           integers: {
//             example: [-1, 4, 0, 39]
//             whole: {
//               example: [0, 1, 2]
//               natural: {
//                 example: [1, 2, 3]
//             }...
//     `);

// console.log(`
//     Unit [1][2] Algebraic Properties

//     - Commutative property addition or multiplication simply states that re-ordering the expressions doesn't affect the result
//       Commutative property of addition states that a + b = b + a. Commute means to move. In this sense, to move the order of expressions.
//       1 + 2 = ${1 + 2} is the same as 2 + 1 = ${2 + 1}
//       Commutative property of multiplication states that a * b = b * a.
//       3 * 2 = ${3 * 2} is the same as 2 * 3 = ${2 * 3}

//     - Associative property of addition or multiplication states that the grouping of 3 or more terms (numbers) doesn't affect the result
//       Associative property of addition states that a + (b + c) = b + (a + c)
//       1 + (2 + 3) = ${1 + (2 + 3)} is the same as 2 + (1 + 3) = ${2 + (1 + 3)}

//       Associative property of multiplication states that a * (b * c) = b * (a * c)
//       4 * (2 * 3) = ${4 * (2 * 3)} is the same as 2 * (4 * 3) = ${2 * (4 * 3)}

//     - Commutative relates to the order of the numbers. Associative relates to the grouping of the numbers.

//     - Distribute property of multiplication over addition states that a * (b + c) = a * b + a * c or a(b + c) = ab + ac
//       5 * (1 + 3) = ${5 * (1 + 3)} is the same as 5 * 1 + 5 * 3 = ${5 * 1 + 5 * 3}
//       It states that when we multiply a number to a group of numbers added together, it's the same as multiplying the number to the group of numbers one by one and summing the result
//       Distributing means giving the number to the group of numbers

//     - Distribute property of multiplication over subtraction states that a * (b - c) = a * b - a * c or a(b - c) = ab - ac
//       5 * (1 - 3) = ${5 * (1 - 3)} is the same as 5 * 1 - 5 * 3 = ${5 * 1 - 5 * 3}
//       It's the same as addition.

//     - Distribute property also works for expression with multiple terms.
//       5 * (1 - 3 + 5 - 5) = ${5 * (1 - 3 + 5 - 5)} is the same as 5 * 1 - 5 * 3 + 5 * 5 - 5 * 5 = ${5 * 1 - 5 * 3 + 5 * 5 - 5 * 5}
//     `);

// console.log(`
//     Unit [1][2] Order of Operations

//     - 1st [] or ()
//     - 2nd Exponents, roots, or absolute value (left to right)
//     - 3rd Multiplication and division (left to right)
//     - 4th Addition and substraction (left to right)
//     `);
console.log(`
    
    
    
    `);

const expr = "[((32 + 1) + (21.33 * ((42.3 - 1) / 53))) * (1 - 2 / 2))] + [(3) / 2]".replaceAll(" ", "");

function tokenize(expr) {
	const tokens = [];
	let buffer = "";

	for (let i = 0; i < expr.length; i++) {
		const char = expr[i];

		if (/\d|\./.test(char)) {
			buffer += char;
		} else {
			if (buffer.length) {
				tokens.push(parseFloat(buffer));
				buffer = "";
			}
			if (/[+\-*/()[\]]/.test(char)) {
				tokens.push(char);
			}
		}
	}

	if (buffer.length) {
		tokens.push(parseFloat(buffer));
	}

	return tokens;
}

// --- Recursive Descent Parser ---

function parse(tokens) {
	let i = 0;

	function peek() {
		return tokens[i];
	}

	function consume() {
		return tokens[i++];
	}

	function parseExpression() {
		return parseAddSub();
	}

	function parseAddSub() {
		let node = parseMulDiv();

		while (peek() === "+" || peek() === "-") {
			const operator = consume();
			const right = parseMulDiv();
			node = {
				type: "BinaryExpression",
				operator,
				left: node,
				right,
			};
		}

		return node;
	}

	function parseMulDiv() {
		let node = parsePrimary();

		while (peek() === "*" || peek() === "/") {
			const operator = consume();
			const right = parsePrimary();
			node = {
				type: "BinaryExpression",
				operator,
				left: node,
				right,
			};
		}

		return node;
	}

	function parsePrimary() {
		const token = consume();

		if (typeof token === "number") {
			return { type: "Literal", value: token };
		}

		if (token === "(" || token === "[") {
			const expr = parseExpression();
			const closing = token === "(" ? ")" : "]";
			if (consume() !== closing) {
				throw new Error("Mismatched parentheses or brackets");
			}
			return expr;
		}

		throw new Error("Unexpected token: " + token);
	}

	return parseExpression();
}
function evaluate(node) {
	if (node.type === "Literal") {
		return node.value;
	}

	if (node.type === "BinaryExpression") {
		const left = evaluate(node.left);
		const right = evaluate(node.right);

		switch (node.operator) {
			case "+":
				return left + right;
			case "-":
				return left - right;
			case "*":
				return left * right;
			case "/":
				return left / right;
			default:
				throw new Error("Unknown operator: " + node.operator);
		}
	}

	throw new Error("Unknown node type: " + node.type);
}

const expression = "1";
const tokens = tokenize(expression);
console.log(tokens);
const ast = parse(tokens);
console.log(ast);
const result = evaluate(ast);

console.log("Result:", result);
