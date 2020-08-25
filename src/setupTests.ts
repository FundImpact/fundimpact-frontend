// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

/**
 * @description We want the errors (not warnings) during the testing,
 * to be treated as fail case. This will keep the code base clean from
 * any unintended changes in the test files itself. To achieve this feature,
 * here we are keeping the default behaviour of console.error intact and
 * throwing the message as Error so that jest will consider them as a fail case.
 *
 * To achieve similar functionality for warnings, use the same logic and attach
 * it to console.warning.
 *
 */
let error = console.error;

console.error = function (message: any) {
	error.apply(console, arguments as any); // keep default behaviour
	throw message instanceof Error ? message : new Error(message);
};
