type Person = {
    nombre: string,
    edad: number,
    pareja: boolean,
    nombrePareja: string
}

const persona1: Person = {
    nombre: "David",
    edad: 20,
    pareja: false,
    nombrePareja: ""
}

//Mediante un objeto, imprirmir sus claves y valores mediante un array
type Pair = {
    key: string,
    value: string | boolean | number | undefined
}

const result = Object.keys(persona1).reduce( (acc: Array<Pair>, key) => {
    acc.push({
        key: key,
        value: persona1[key as keyof typeof persona1]
    });
    return acc;
}, []);

console.log(result);

//----------------------------------------------------------------------------------------------

//Mediante un array con claves y valores, construir un objeto
result.reduce( (acc, elem) => {
    return{
        ... acc,
        [elem.key]: elem.value,
    }
}, []);

//Sobreescribir claves
const a = {
    pais: "España",
    ciudad: "Madrid",
    habitantes: "+3.000.000"
}

const b = {
    ... a,
    ciudad: "Barcelona"
}

console.log(a);
console.log(b);