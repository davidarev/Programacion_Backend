//EJERCICIO 1 - Convertir un array en minusculas a mayusculas
const nombres_minusculas: string[] = ["david", "juan", "pepe"];
const nombres_mayusculas: string[] = nombres_minusculas.map((elem: string):string => elem.toUpperCase());
console.log(nombres_mayusculas);

//EJERCICIO 2 - Filtrar numeros pares
const numeros: number[] = [1, 2, 3, 4, 5, 6];
const pares: number[] = numeros.filter((elem: number) => elem % 2 === 0);
console.log(pares);

//EJERCICIO 3 - Sumar longitudes de palabras
const nombres: string[] = ["david", "juan", "pepe"];
const size: number[] = nombres.map((elem: string): number => elem.length);
console.log(size);
let suma: number = 0; for(let i = 0; i < size.length; i++) suma += size[i];
console.log(suma);

//EJERCICIO 4 - Devolver los nombres de las personas que tengan 18 años o mas
type Persona = {
    nombre: string;
    edad: number;
}
const personas: Persona[] = [
    {nombre: "David", edad: 22},
    {nombre: "Jorge", edad: 48},
    {nombre: "Juanma", edad: 5},
    {nombre: "Kerit", edad: 52},
    {nombre: "Santi", edad: 2},
    {nombre: "Andrea", edad: 43},
    {nombre: "Lucia", edad: 1},
]
const nombres_mayores_18: string[] = personas
    .filter((elem: Persona) => elem.edad >= 18)
    .map((elem: Persona): string => elem.nombre);
console.log(nombres_mayores_18);