/**
 * Utiliza el método `reduce` para calcular la suma de todos los números en el siguiente array.
 * const numeros: number[] = [5, 10, 15, 20, 25];
 */

const numeros: number[] = [5, 10, 15, 20, 25];

const suma: number = numeros.reduce((acumulador: number, elem: number) => {
    acumulador += elem;
    return acumulador;
}, 0);
console.log(suma);