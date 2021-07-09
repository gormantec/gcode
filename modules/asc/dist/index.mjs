/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/assemblyscript/dist/sdk.js":
/*!*************************************************!*\
  !*** ./node_modules/assemblyscript/dist/sdk.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const BINARYEN_VERSION = \"101.0.0-nightly.20210604\";\nconst LONG_VERSION = \"4.0.0\";\nconst ASSEMBLYSCRIPT_VERSION = \"0.19.5\";\n\n// AMD/require.js (browser)\nif (true) {\n  const paths = {\n    \"binaryen\": \"https://cdn.jsdelivr.net/npm/binaryen@\" + BINARYEN_VERSION + \"/index\",\n    \"long\": \"https://cdn.jsdelivr.net/npm/long@\" + LONG_VERSION + \"/dist/long\",\n    \"assemblyscript\": \"https://cdn.jsdelivr.net/npm/assemblyscript@\" + ASSEMBLYSCRIPT_VERSION + \"/dist/assemblyscript\",\n    \"assemblyscript/cli/asc\": \"https://cdn.jsdelivr.net/npm/assemblyscript@\" + ASSEMBLYSCRIPT_VERSION + \"/dist/asc\",\n  };\n  __webpack_require__(\"./node_modules/assemblyscript/dist sync recursive\").config({ paths });\n  __webpack_require__.amdD(Object.keys(paths), (binaryen, long, assemblyscript, asc) => ({\n    BINARYEN_VERSION,\n    LONG_VERSION,\n    ASSEMBLYSCRIPT_VERSION,\n    binaryen,\n    long,\n    assemblyscript,\n    asc\n  }));\n\n// CommonJS fallback (node)\n} else {}\n\n\n//# sourceURL=webpack://asc/./node_modules/assemblyscript/dist/sdk.js?");

/***/ }),

/***/ "./node_modules/assemblyscript/dist sync recursive":
/*!************************************************!*\
  !*** ./node_modules/assemblyscript/dist/ sync ***!
  \************************************************/
/***/ ((module) => {

eval("function webpackEmptyContext(req) {\n\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = () => ([]);\nwebpackEmptyContext.resolve = webpackEmptyContext;\nwebpackEmptyContext.id = \"./node_modules/assemblyscript/dist sync recursive\";\nmodule.exports = webpackEmptyContext;\n\n//# sourceURL=webpack://asc/./node_modules/assemblyscript/dist/_sync?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"asc\": () => (/* reexport default from dynamic */ assemblyscript_dist_sdk__WEBPACK_IMPORTED_MODULE_0___default.a)\n/* harmony export */ });\n/* harmony import */ var assemblyscript_dist_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! assemblyscript/dist/sdk */ \"./node_modules/assemblyscript/dist/sdk.js\");\n/* harmony import */ var assemblyscript_dist_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(assemblyscript_dist_sdk__WEBPACK_IMPORTED_MODULE_0__);\n\n\n\n\n\n//# sourceURL=webpack://asc/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;