//MAP: FUNCION QUE TRANSFORMA UN ARRAY EN OTRO MEDIANTE UNA FUNCION / CAMBIO

const array: number[] = [1, 2, 3, 4, 5];
const arraydoble = array.map((elem: number) => 2 * elem); // -> [2, 4, 6, 8, 10]

//--------------------------

type Person = {
    nombre: string,
    edad: number,
}

const personas = [
    {nombre: "David", edad: 22},
    {nombre: "Jorge", edad: 48},
]

const nombres: string[] = personas.map((elem: Person) => elem.nombre); // ->  ["David", "Jorge"]