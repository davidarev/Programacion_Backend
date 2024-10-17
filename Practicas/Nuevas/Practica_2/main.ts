/*
Para esta segunda práctica se pide desarrollar una API REST en Deno donde estén las siguientes rutas:
  Ruta 1: /jokes
  Esta ruta lo que hara sera devolver una broma aleatoria en el siguiente array, en caso de que el usuario 
  pase por parámetro index un número, esta deberá devolver la broma que se encuentre en ese índice
  const developerJokes = [ 
  "¿Por qué los desarrolladores odian la naturaleza? Porque tiene demasiados bugs.", 
  "Un SQL entra en un bar, se acerca a dos mesas y pregunta: '¿Puedo unirme?'", 
  "¡He terminado mi código a tiempo! – Nadie, nunca.", 
  "Si no funciona, añade más console.log().", 
  "¿Cuántos programadores se necesitan para cambiar una bombilla? Ninguno, es un problema de hardware.", 
  "No me asusto fácilmente... excepto cuando veo código sin ; al final.", 
  "Los desarrolladores no envejecen, solo se depuran.", 
  "El único lugar donde puedes escapar de una excepción es en Java.", 
  "Frontend sin diseño es como un backend sin lógica.", 
  "¿Por qué los programadores prefieren el té? Porque en Java no hay café.", 
  "Hay 10 tipos de personas en el mundo: las que entienden binario y las que no.", 
  "Siempre prueba tu código... excepto cuando funciona.", 
  "Tu código no está roto, solo es 'funcionalidad no documentada'.", 
  "En qué se parecen los programadores y los gatos? En que odian mojarse y no pueden dejar de jugar con cosas que no deberían.", "
  Mi código funciona... hasta que lo toco de nuevo.", "¿Por qué los desarrolladores odian la luz del sol? Porque depuran en la oscuridad.", 
  "Cuando crees que has eliminado todos los bugs, aparece el 'bug final'.", "Git es como un horóscopo: nunca entiendes los conflictos.", 
  "Un desarrollador sin bugs es como un unicornio, no existe.", "En mi máquina funciona... pero no en producción." 
  ];

  Ruta 2: /calcular
  Esta ruta realizará operaciones matemáticas sencillas. Los alumnos deben crear la lógica 
  para realizar sumas, restas, multiplicaciones o divisiones a través de los parámetros.
  Descripción: Realiza una operación matemática con dos números.
  Query Params requeridos:
  num1 (el primer número de la operación)
  num2 (el segundo número de la operación)
  operacion (el tipo de operación: puede ser suma, resta, multiplicacion, division)
  Ejemplo de uso:
  /calcular?num1=10&num2=5&operacion=suma -> 15
  /calcular?num1=20&num2=4&operacion=division -> 5
  /calcular?num1=3&num2=7&operacion=multiplicacion -> 21
  /calcular?num1=9&num2=3&operacion=resta -> 6
  Notas adicionales:
  Para la división, verificar que el divisor no sea 0 y devolver un mensaje de error si es así: "Error: No se puede dividir por 0".

  Ruta 3: /reverso
  Esta ruta tomará una palabra o frase como parámetro y devolverá la misma cadena pero al revés.
  Descripción: Devuelve la palabra o frase dada en orden inverso.
  Parámetro URL: frase
  Query Param opcional:
  detalles (booleano). Si está presente y es true, la respuesta debe incluir la longitud de la frase original.
  Ejemplo de uso:
  /reverso/hola -> "aloh"
  /reverso/hello world -> "dlrow olleh"
  /reverso/Fernando?detalles=true -> { "reverso": "odnanreF", "longitud": 8 }
*/

const developerJokes: String[] = [ 
  "¿Por qué los desarrolladores odian la naturaleza? Porque tiene demasiados bugs.", 
  "Un SQL entra en un bar, se acerca a dos mesas y pregunta: '¿Puedo unirme?'", 
  "¡He terminado mi código a tiempo! – Nadie, nunca.", 
  "Si no funciona, añade más console.log().", 
  "¿Cuántos programadores se necesitan para cambiar una bombilla? Ninguno, es un problema de hardware.", 
  "No me asusto fácilmente... excepto cuando veo código sin ; al final.", 
  "Los desarrolladores no envejecen, solo se depuran.", 
  "El único lugar donde puedes escapar de una excepción es en Java.", 
  "Frontend sin diseño es como un backend sin lógica.", 
  "¿Por qué los programadores prefieren el té? Porque en Java no hay café.", 
  "Hay 10 tipos de personas en el mundo: las que entienden binario y las que no.", 
  "Siempre prueba tu código... excepto cuando funciona.", 
  "Tu código no está roto, solo es 'funcionalidad no documentada'.", 
  "En qué se parecen los programadores y los gatos? En que odian mojarse y no pueden dejar de jugar con cosas que no deberían.", 
  "Mi código funciona... hasta que lo toco de nuevo.", "¿Por qué los desarrolladores odian la luz del sol? Porque depuran en la oscuridad.", 
  "Cuando crees que has eliminado todos los bugs, aparece el 'bug final'.", "Git es como un horóscopo: nunca entiendes los conflictos.", 
  "Un desarrollador sin bugs es como un unicornio, no existe.", "En mi máquina funciona... pero no en producción." 
];

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const handler = async (req: Request): Promise<Response> => {
  const metodo = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if(metodo === "GET"){
    //Ejercicio 1
    if(path === "/jokes"){
      const posicion = url.searchParams.get("posicion");
      if(!posicion) {
        const randomInt = getRandomInt(0, developerJokes.length);
        return new Response(JSON.stringify(developerJokes[randomInt]), {status: 200});
      }
      else{
        const joke = developerJokes.find((elem: String) => elem === developerJokes[parseInt(posicion)]);
        if(!joke) return new Response("Joke not found", {status: 404});
        else return new Response(JSON.stringify(joke), {status: 404});
      }
    }
    //Ejercicio 2
    else if(path === "/calcular"){
      const num1 = url.searchParams.get("num1");
      const num2 = url.searchParams.get("num2");
      const operacion = url.searchParams.get("operacion");

      if(!num1 || !num2 || !operacion) return new Response("Bad request", {status: 400});
      else{
        if(operacion === "suma"){
          const resultado: number = parseInt(num1) + parseInt(num2);
          return new Response(JSON.stringify(resultado), {status: 200});
        }
        if(operacion === "resta"){
          const resultado: number = parseInt(num1) - parseInt(num2);
          return new Response(JSON.stringify(resultado), {status: 200});
        }
        if(operacion === "multiplicacion"){
          const resultado: number = parseInt(num1) * parseInt(num2);
          return new Response(JSON.stringify(resultado), {status: 200});
        }
        if(operacion === "division"){
          if(num2 === "0") return new Response("No se puede dividir entre 0", {status: 400});
          else{
            const resultado: number = parseInt(num1) / parseInt(num2);
            return new Response(JSON.stringify(resultado), {status: 200});
          }
        }
        else return new Response("Bad request", {status: 400});
      }
    }
    //Ejercicio 3
    else if(path === "/reverso"){
      const palabra_frase: String | null = url.searchParams.get("palabra_frase");
      if(!palabra_frase) return new Response("Bad request", {status: 400});
      else{
        let reverso: String = "";
        for(let i = palabra_frase.length - 1; i >= 0; i--){
          reverso += palabra_frase[i];
        }
        return new Response(JSON.stringify(reverso), {status: 200});
      }
    }
    else{
      return new Response("Bad request", {status: 404});
    }
  }

  return new Response("Endpoint not found", {status: 404});
}

Deno.serve({port: 3000}, handler);
