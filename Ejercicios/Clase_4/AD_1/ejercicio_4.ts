/**
 * Dado un array de palabras, encuentra la palabra más larga.
 * const palabras: string[] = ["manzana", "banana", "fresa", "kiwi", "sandía"];
 */

const palabras: string[] = ["manzana", "banana", "supercalifragilisticoespiadiloso", "kiwi", "sandía"];

const palabra_mas_larga: string = palabras.reduce((acumulador: string, elem: string) => {
    if(acumulador.length < elem.length) acumulador = elem;
    return acumulador;
}, palabras[0])

console.log(palabra_mas_larga);