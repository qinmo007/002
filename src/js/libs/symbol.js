/**
 * ES6 Symbol polyfill
 */

let idCounter = 0

const Symbol = function Symbol(key) {
  return `__${key}_${Math.floor(Math.random() * 1e9)}_${++idCounter}__`
}

Symbol.iterator = Symbol('Symbol.iterator')

window.Symbol = Symbol
