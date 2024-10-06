/**
 * Dado un array de objetos que representan estudiantes con sus nombres y notas, 
 * crea un nuevo array con los nombres de los estudiantes que tienen una nota mayor o igual a 60.
 * const estudiantes: Estudiante[] = [
   { nombre: "Alicia", nota: 85 },
   { nombre: "Luis", nota: 70 },
   { nombre: "Carlos", nota: 45 },
   { nombre: "David", nota: 60 },
  ];
 */
type Estudiante = {
  nombre: string;
  nota: number;
};

const estudiantes: Estudiante[] = [
  { nombre: "Alicia", nota: 85 },
  { nombre: "Luis", nota: 70 },
  { nombre: "Carlos", nota: 45 },
  { nombre: "David", nota: 60 },
];

const nombres_estudiantes_nota_mayorigual60: string[] = estudiantes
  .filter((elem: Estudiante): boolean => elem.nota >= 60)
  .map((elem: Estudiante): string => elem.nombre);

console.log(nombres_estudiantes_nota_mayorigual60);
