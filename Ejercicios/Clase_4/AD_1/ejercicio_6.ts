/**
 * Dado un array de objetos que representan estudiantes con sus nombres y notas, encuentra si alguno ha obtenido menos de 50 puntos (no es necesario decir cuál, solo si hay alguno)
 * const estudiantes: Estudiante[] = [
   { nombre: "Alicia", nota: 85 },
   { nombre: "Jose", nota: 70 },
   { nombre: "Carlos", nota: 92 },
   { nombre: "David", nota: 88 },
  ];
 */

type Estudiante = {
    nombre: string,
    nota: number,
}

const estudiantes: Estudiante[] = [
    { nombre: "Alicia", nota: 85 },
    { nombre: "Jose", nota: 70 },
    { nombre: "Carlos", nota: 92 },
    { nombre: "David", nota: 88 },
];

const comprobacion: boolean = estudiantes.some((elem: Estudiante): boolean => elem.nota < 50);
if(comprobacion) console.log("Hay al menos un estudiante con una nota menor a 50 puntos");
else console.log("Todos los estudiantes tienen mas de 50 puntos");