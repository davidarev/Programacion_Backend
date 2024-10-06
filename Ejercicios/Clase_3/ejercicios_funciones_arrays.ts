/**
 * Tienes un array de nombres en mayusculas. 
 * Debes transformarlos a minusculas y almacenarlos en un nuevo array.
 */

const array_mayusculas: string[] = ["HOLA", "ADIOS", "SUPERCALIGRAGILISTICOESPEADILOSO", "BUENAS"];
const array_minusculas: string[] = array_mayusculas.map((elem: string): string => elem.toLowerCase());
console.log(array_minusculas);

/**
 * Dado un array de números, debes filtrar aquellos que sean mayores a 10.
 */

const array_numeros: number[] = [1, 2, 33, 4, 55, 6, 77, 8, 99];
const mayores_10: number[] = array_numeros.filter((elem: number): boolean => elem > 10);
console.log(mayores_10);

/**
 * Dado un array de números, debes encontrar el primer número que sea mayor o igual a 50.
 */
const numero_mayor50 = array_numeros.find((elem: number) => elem >= 50);
console.log(numero_mayor50);

/**
 * Dado un array de números, debes comprobar si todos los elementos son positivos (mayores que 0).
 */

const son_positivos: boolean = array_numeros.every((elem: number): boolean => elem >= 0);
if(son_positivos) console.log("Todos los numeros del array son positivos");
else console.log("El array tiene algún numero negativo");

/**
 * Tienes un array de números. Debes comprobar si al menos uno de los números es par.
 */

const es_par: boolean = array_numeros.some((elem: number): boolean => elem % 2 === 0);
if(es_par) console.log("Hay al menos un numero par en el array");
else console.log("En el array no hay ningun numero par");

/**
 * Tienes un array de números. Debes mostrar el doble de cada número en la consola.
 */

const array_doble: number[] = array_numeros.map((elem: number) => elem * 2);
console.log(array_doble);

/**
 * Dado un array de números, utiliza reduce para calcular la suma total de todos los elementos.
 */

const suma_valores: number = array_numeros.reduce((acumulador: number, elem: number) => {
    acumulador += elem;
    return acumulador;
}, 0);
console.log(suma_valores);

/**
 * Dado un array de palabras, utiliza reduce para encontrar la palabra más larga del array.
 */

const palabra_mayor: string = array_mayusculas.reduce((acumulador: string, elem: string) => {
     if(acumulador.length < elem.length) acumulador = elem;
    return acumulador;
}, array_mayusculas[0]);
console.log(palabra_mayor);

/**
 * Dado un array de objetos que representan productos con un precio y una cantidad, filtra aquellos productos que tienen un precio mayor a 50, 
 * transforma los precios para añadirles un 10% de impuesto unicamente a esos productos, y finalmente suma el total de los precios de esos los productos.
 */

type Producto = {
    nombre: string,
    precio: number,
    cantidad: number,
}

const productos = [
    { nombre: "Producto A", precio: 30, cantidad: 1 },
    { nombre: "Producto B", precio: 60, cantidad: 3 },
    { nombre: "Producto C", precio: 100, cantidad: 1 },
    { nombre: "Producto D", precio: 20, cantidad: 5 }
];

const productos_mayor50: Producto[] = productos.filter((elem: Producto) => elem.precio > 50);
const precio_con_impuesto: Producto[] = productos_mayor50.map((elem: Producto) => ({
    //modifico el elmento original
    ...elem, 
    precio: elem.precio * 1.10,
}));
const precio_total: number = precio_con_impuesto.reduce((acumulador: number, elem: Producto) => {
    acumulador += elem.precio * elem.cantidad;
    return acumulador;
}, 0);
console.log(precio_total);

/**
 * Dado un array de personas con nombre y edad, encuentra a la persona más joven que tenga 18 años o más.
 */

type Persona = {
    nombre: string,
    edad: number,
}

const personas = [
    { nombre: "Pedro", edad: 20 },
    { nombre: "Ana", edad: 16 },
    { nombre: "Luis", edad: 22 },
    { nombre: "Lucía", edad: 15 }
];
const primera_persona_mayor18: Persona | undefined = personas.find((elem: Persona) => elem.edad >= 18);
console.log(primera_persona_mayor18);

/**
 * Tienes un array de strings que representan nombres de personas. 
 * Debes primero convertir todos los nombres a mayúsculas, luego filtrar aquellos nombres que comiencen con la letra "A", y finalmente contar cuántos de esos nombres cumplen la condición.
 */
const nombres = ["Ana", "Pedro", "Andrea", "Carlos", "Alberto", "Lucía"];
const mayusculas: string[] = nombres.map((elem: string) => elem.toUpperCase());
const empieza_A: string[] = mayusculas.filter((elem: string) => elem[0] === 'A');
const numero_nombres: number = empieza_A.reduce((acumulador: number) => {
    acumulador++;
    return acumulador;
}, 0);
console.log(empieza_A);
console.log(numero_nombres);