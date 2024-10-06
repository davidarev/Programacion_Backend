/**
 * Dado el siguiente array de números, crea un nuevo array que contenga solo los números pares.
 * const numeros: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * rellenar solo con el código de la función (sin repetir el código ya dado), por ejemplo:
 * numeros.find( a => a === 1 );
 */

const numeros: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const pares: number[] = numeros.filter((elem: number) => elem % 2 === 0);
console.log(pares);