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