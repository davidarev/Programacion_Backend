type Coche = {
    marca: string,
    matricula: string
}
type Persona = {
    nombre: string,
    edad: number,
    amigos: string[],
    coche: Coche;
    pareja: boolean,
    nombrePareja: string
}

const david: Persona = {
    nombre: "David",
    edad: 20,
    amigos: ["Santi", "Valen", "Juanes"],
    coche: {
        marca: "Mercedes",
        matricula: "1234BBB"
    },
    pareja: false,
    nombrePareja: ""
};

const santi: Partial<Persona> = {
    nombre: "Santi",
    edad: 20,
    amigos: ["David", "Valen", "Juanes"],
};

const juanes: Omit<Persona, "amigos"> = {
    nombre: "Juanes",
    edad: 21,
    coche: {
        marca: "Seat",
        matricula: "1234BBC"
    },
    pareja: false,
    nombrePareja: ""
};

david.edad = 20;
juanes["pareja"] = true;
juanes.nombrePareja = "Elena";

//----------------------------------------------------------------

type Person = {
    nombre: string,
    edad: number,
}
const persons: Person[] = [
    {nombre: "David", edad: 20},
    {nombre: "Santi", edad: 20},
    {nombre: "Valen", edad: 20},
    {nombre: "Juanes", edad: 21}
]

const sSnti = persons.find(p => p.nombre === "Santi");
if(sSnti) console.log(sSnti.edad)

type Estudiante = {
    universidad: string,
    curso: number
}

const valen: Estudiante & Person = {
    universidad: "URJC",
    curso: 3,
    nombre: "Valen",
    edad: 20
}

Object.keys(valen).forEach(key => console.log(valen[key as keyof typeof valen]));
console.log(Object.values(valen))