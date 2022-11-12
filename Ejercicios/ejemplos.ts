// Ej1 1Partiendo de un array que tiene numeros del 1 al 10, hacer otro array que tenga/muestre numeros pares
const arr: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; //El map convierte todo el array; el map filtra los elementos que cumplan una condicion
const par: number[] = arr.filter(elem => elem % 2 === 0);
console.log(par);

//Ej2 Hallar el maximo
const max = arr.reduce((acc: number, elem: number) => {
    if(elem > acc) return elem;
    else return acc;
}, arr[0]);
console.log(max);

//Ej3 Comprobar si todos los numeros son mayores que 10
const mayorQue10 = !arr.some(elem => elem < 10);
console.log(mayorQue10);

//Ej4 Array que sea el doble que el otro
let doble = arr.map(elem => 2 * elem);
console.log(doble);

doble = arr.reduce((acc: number[], elem: number) => {
    return [...acc, 2 * elem];
}, []);
console.log(doble);

//Ej5 Funcion que devuelva el array invertido
const invertido = arr.reduce((acc: number[], elem: number) => {
    return [elem, ...acc];
}, []);
console.log(invertido);