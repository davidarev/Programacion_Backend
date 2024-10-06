//FOR EACH: FUNCION QUE HACE ALGO SOBRE CADA UNO DE LOS ELEMENTOS

//Array
const array: number[] = [2,6,4,7,75,4,688,4,27,25];


//Opcion 1
const elemento = (a: number) => console.log(a); //Funcion que devuelve un numero
array.forEach(elemento); //For each ejecuta la funcion anterior

//Opcion 2
array.forEach((a: number) => console.log(a));

//------------------------
array.forEach((elem: number, i: number) => {
    console.log(elem, i);
});
console.log('----------------------------');
//EJEMPLO: MOSTRAR LOS ELEMENTOS CUYO INDICE ES PAR
array.forEach((elem: number, i: number) => {
    if (i % 2 === 0) console.log(elem);
});