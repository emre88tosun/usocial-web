/** @type {import("prettier").Options} */
const config = {
	// Use semicolons at the end of statements
	semi: true,
	// Use trailing commas where possible in ES5 (objects, arrays, etc.)
	trailingComma: "es5",
	// Use single quotes instead of double quotes
	singleQuote: true,
	// Wrap lines that exceed 160 characters
	printWidth: 80,
	// Set the number of tabs per indentation-level to 2
	tabWidth: 2,
	// Use tabs instead of spaces for indentation
	useTabs: false,
	// Use double quotes in JSX
	jsxSingleQuote: false,
	// Print spaces between brackets in object literals
	bracketSpacing: true,
	// Put the > of a multi-line JSX element at the end of the last line
	jsxBracketSameLine: false,
	// Include parentheses around a sole arrow function parameter
	arrowParens: "always",
	// Ensure the use of Line Feed (\n) for line breaks (common in UNIX)
	endOfLine: "lf",
	plugins: ["prettier-plugin-tailwindcss"],
	tailwindFunctions: ["cn"],
};

module.exports = config;
