"use strict"

/**
 * Возвращает x, возведённое в n-ную степень.
 *
 * @param {number} x Возводимое в степень число.
 * @param {number} n Степень, должна быть натуральным числом.
 * @return {number} x, возведённое в n-ную степень.
 */
function pow(x, n) {
    let res = x;
    let c = 1;
    if (n == 0) {
        x = 1;
        res = x;

    } else if (n < 0) {
        for (let i = n; i < 0; i++) {
            c /= x;
            res = c;
        }

    } else {
        for (let i = 1; i < n; i++) {
            res *= x;
        }
    }
    return res;

}
/**
 * Возвращает сумму от 1 до f
 * @param {number} f 
 */
function sunTo(f) {
    let sum = 0;

    for (let i = 1; i <= f; i++) {
        sum += i
    }
    return sum;

}

/**
 * Возвращает факториал числа l
 * @param {number} n 
 */
function factorial(n) {
    if (n == 0) {
        return 1
    } else {
        return n * factorial(n - 1);
    }
}

/**
 * Возвращает число Фибоначии w
 * @param {number} f 
 */
function fib(f) {
    let a = 1;
    let b = 1;
    for (let i = 3; i <= f; i++) {
        let c = a + b;
        a = b;
        b = c;
    }
    return b;
}

/**
 * Возвращает результат сравнения числа k с числом y
 * @param {number} x 
 */

function compare(x) {

    let res = function(y) {

        if (y > x) return true

        else if (y < x) return false

        else return null;

    }
    return res;
}

/**
 * Возвращает числа от 0 до num в виде таблицы с количеством колонок равным cols
 * @param {number} num 
 * @param {number} cols 
 * @returns 
 */
function printNumbers(num, cols) {
    let r = num / cols;
    let res = '';
    for (let row = 0; row < r; row++) {

        let str = '';

        for (let j = 0; j < cols; j++) {

            let step = row + (j * r);

            if (step < num)

                str += step + ' ';
            step = step + str;
        };

        res += str + '\n';

    }

    return res
}