//Funcion que transforma un string en un numero.
export function ConvertirNumber(s: string): number {
   try {
      return parseInt(s);
   } catch (e) {
      console.error(e);
      return -1;
   }
}

//Funcion que me aplana el array. Da igual los tipos que tenga como entrada, lo unico que hace es aplanarlo.
export function ArrayFlat(a:any[]):any[]{
   return a.flat(Number.MAX_VALUE);
}
//Funcion que transforma los datos del array en numeros.
export function ConvertirArrNumber(arr:any[]):number[]{
   const arraydeVuelta:number[]=[];
   arr.forEach(element => {
      if(typeof (element)==="string"){
         arraydeVuelta.push(parseInt(element))
      }else{
         arraydeVuelta.push(element)
      }
   });
   return arraydeVuelta
}

export function TransformarArraySinFallas(arr:number[]):number[]{
   const arraydeVuelta:number[]=[]
   arr.forEach(element => {
      const indice=arr.indexOf(element);
      const dato= arr.splice(indice,1);
      const dato_array=arr.reduce((p:number,elem:number)=>p*elem)
      arraydeVuelta.push(dato_array);
      const numero:number|undefined=dato.at(0)
      if(typeof(numero)==="number")arr.splice(indice,0,numero)
   });
   return arraydeVuelta;
}
//Creo que este es el metodo que nos pides hacer en la practica pero he encontrado varias fallas al aplicarlo ya que si hay un dato duplicado en el array no se puede
//aplicar ninguna de las funciones que hemos visto en clase. Esto es porque nos va a devolver el indice de la primera vez que aparece el dato.
/*function TransformarArrayFuncionesClase(arr:number[]):number[]{
   const arraydeVuelta:number[]=[]
   arr.forEach(element => {
      const indice=arr.indexOf(element)
      const nuevoARr=arr.filter((ele:[i])=>ele!=indice+1);
      const datos=nuevoARr.reduce((pos:number,elem:number)=>pos*elem);
      arraydeVuelta.push(datos)
   });
   return arraydeVuelta;
}*/



const miarray=[1,2,[3,4,["5",2]]]

const resultado=TransformarArraySinFallas(ConvertirArrNumber(ArrayFlat(miarray)))

console.log("El array original es "+miarray)
console.log("El resultado tras aplicar el ejercicio 1 es "+resultado);

