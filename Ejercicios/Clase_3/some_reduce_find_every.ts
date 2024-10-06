//SOME - FUNCION QUE DEVUELVE UN BOOLEAN QUE INDICA SI ALGUN ELEMENTO CUMPLE UN CRITERIO EN UN ARRAY, PERO NO INDICA CUAL

//EVERY - FUNCION QUE DEVUELVE UN BOOLEAN QUE INDICA SI TODOS LOS ELEMENTOS DE UN ARRAY CUMPLE UN CRITERIO

//FIND - FUNCION QUE DEVUELVE EL PRIMER ELEMENTO DE UN ARRAY QUE CUMPLA UN CRITERIO

//FINDLAST - FUNCION QUE DEVUELVE EL ULTIMO ELEMENTO DE UN ARRAY QUE CUMPLA UN CRITERIO

/*REDUCE - FUNCION QUE RECIBE DOS PARAMETROS, LA FUNCION Y EL ACUMULADOR, EL TIPO QUE DEVUELVE ES DEL TIPO DEL ACUMULADOR.
LA FUNCION RECIBE DOS PARAMETROS, EL PRIMER PARAMETRO ES DEL MISMO TIPO DEL ACUMULADOR Y TIPO DEL ELEMENTO DEL ARRAY.
DEVUELVE EL TIPO DEL ACUMULADOR
*/
const arr: number[] = [1, 2, 3, 4, 5];
const suma: number = arr.reduce((acumulador: number, elem: number) => acumulador = elem, 0);
//acumulador = 0; acumulador = f(acumulador, elem) --> f(0, 1) --> acumulador = 1; f(1, 2) --> acumulador = 3, ...



//Si hay alguien mayor de 18, tenga un nombre de mas de 7 letras
type Persona = {
    nombre: string;
    edad: number;
}
const personas: Persona[] = [
    {nombre: "David", edad: 22},
    {nombre: "Jorge", edad: 48},
    {nombre: "Juan Manuel", edad: 5},
    {nombre: "Kerit", edad: 52},
    {nombre: "Santiago", edad: 19},
    {nombre: "Andrea", edad: 43},
    {nombre: "Lucia", edad: 1},
]
const alguien: boolean = personas.some((elem: Persona) => elem.edad >= 18 && elem.nombre.length >= 7);