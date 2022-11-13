/*
Entregar un archivo ejercicio1.ts
Partiendo del array
const arr = [ 2,3,4,2,4,3,32,3,3,5,3,3,3,2,212,2,3];
Hacer otro array que tenga solo los impares y sin repetirse.
*/

const array = [1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1]

//ejercicio1.ts SIMPLE
const impar = array.filter(elem => elem % 2 === 1);
console.log(impar);
const sinRep = impar.reduce((acc: number[], numero: number) => {
    if(acc.some(elem => elem === numero)) return acc;
    else return [... acc, numero];
}, []); 
console.log(sinRep);

//ejercicio1.ts PRO
const imparSinRep = array
    .filter(elem => elem % 2 === 1)
    .reduce((acc: number[], numero: number) => {
        if(acc.includes(numero)) return acc;
        else return [... acc, numero];
    }, []);
console.log(imparSinRep);
