//FILTER: FUNCION QUE FILTRA O SE QUEDA CON ALGUNOS ELEMENTOS DE UN ARRAY_BUFFER

const array:number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const arraymayores5:number[] = array.filter((elem: number) => elem > 5); //Devuelve true si es mayor que 5
console.log(arraymayores5);

//------------------------
const pares: number[] = array.filter((elem: number) => elem % 2 === 0);
console.log(pares);

//------------------------
type Student = {
    nombre: string;
    nota: number;
}

const estudiantes = [
    {nombre: "David", nota: 9},
    {nombre: "Santi", nota: 6},
    {nombre: "Sebas", nota: 3},
]

const aprobados = estudiantes.filter((elem: Student) => elem.nota >= 5); //Filtro por los aprobados
console.log(aprobados);
const nombre_aprobados = aprobados.map((elem: Student) => elem.nombre); //Me quedo unicamente con los nombres
console.log(nombre_aprobados);
