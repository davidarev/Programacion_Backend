/**
 * Dado el siguiente array de números, crea un nuevo array donde los números pares se duplican y los números impares se triplican.
 * const numeros: number[] = [1, 2, 3, 4, 5, 6];
 */

const numeros: number[] = [1, 2, 3, 4, 5, 6];

const nuevo_arr: number[] = numeros.map((elem: number) => {
    if(elem % 2 === 0) return elem * 2;
    else return elem * 3;
})

console.log(nuevo_arr);