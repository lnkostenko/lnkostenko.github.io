"use strict";
/**
 * 
 * @param {number} num 
 * @returns 
 */


function getDecimal(num) {
    num = String(num);
    let a = num.slice(num.indexOf("."));
    if (a == Math.abs(Math.trunc(num) % 10)) {
        return 0;
    }
    let str = 0 + a;
    if (num < 0) {
        str = 1 - str;
    }
    return str;
}

/**
 * 
 * @param {string} str 
 * @returns 
 */

function ucFirst(str) {

    str = str[0].toUpperCase() + str.slice(1);

    return str

}

/**
 * 
 * @param {string} str 
 * @returns 
 */

function checkSpam(str) {
    let lowerStr = str.toLowerCase();

    return lowerStr.includes('viagra') || lowerStr.includes('xxx');
}

/**
 * 
 * @param {string} str 
 * @param {number} maxlength 
 * @returns 
 */

function truncate(str, maxlength) {
    return (str.length > maxlength) ?
        str.slice(0, maxlength - 1) + '…' : str;
}

/**
 * 
 * @param {string} str 
 * @returns 
 */

function camelize(str) {
    str = str.split('-');
    let str1 = str[0];
    for (let i = 1; i < str.length; i++) {
        str1 += ucFirst(str[i]);
    }
    return str1;
}
/**
 * 
 * @param {number} n 
 * @returns возвращает число Фибоначчи
 */

function fib(n) {
    let a = 1n,
        b = 0n;
    for (let i = 0n; i < n; i++) {
        let temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}
/**
 * 
 * @param {number} n 
 * @returns Возвращает массив из чисел Фибоначчи до n
 */
function fibs(n) {
    let fib1 = [];
    for (let i = 0; i < n; i++) {
        fib1.push(fib(i));
    }
    return fib1;
}
/**
 * 
 * @param {array} arr 
 * @returns Возвращает массив сортированных чисел по убыванию
 */

function arrReverseSorted(arr) {

    arr.sort(function(a, b) { return a - b; });

    arr.reverse();

    return arr;
}

/**
 * 
 * @returns Возвращает сумму, заданных аргументов
 */


function sum() {
    var result = 0;

    for (var i = 0; i < arguments.length; i++) {
        result += arguments[i];
    }

    return result;
}
