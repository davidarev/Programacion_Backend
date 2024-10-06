/**
 * Utiliza métodos de array para saber si todos los estudiantes tienen más de 50 puntos
  const estudiantes: Estudiante[] = [
   { nombre: "Alice", nota: 85 },
   { nombre: "Bob", nota: 70 },
   { nombre: "Charlie", nota: 92 },
   { nombre: "David", nota: 88 },
  ];
 */

type Estudiante = {
    nombre: string,
    nota: number,
}

const estudiantes: Estudiante[] = [
    { nombre: "Alice", nota: 85 },
    { nombre: "Bob", nota: 70 },
    { nombre: "Charlie", nota: 92 },
    { nombre: "David", nota: 88 },
];

const comprobacion: boolean = estudiantes.every((elem: Estudiante): boolean => elem.nota > 50);
if(comprobacion) console.log("Todos los estudiantes tienen mas de 50 puntos");
else console.log("Todos los estudiantes NO tienen mas de 50 puntos");
