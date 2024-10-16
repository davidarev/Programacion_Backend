/*
 Ejercicio para que resuelvas en Typescript con Deno:
 Crea un servidor en Deno que gestione una lista de productos, donde cada producto tiene un `id`, un `nombre`, `tipo` y un `precio`. 
 El servidor debe soportar las siguientes operaciones:
  1. GET /products:
    - Devuelve la lista completa de productos.
    - Si se pasa un parámetro `tipo`, devuelve solo los productos que coincidan con ese tipo.

  2. GET /product:
    - Busca un producto por su `id`, el cual debe pasarse como parámetro en la URL.
    
  3. POST /product:
    - Añade un nuevo producto enviando un objeto JSON con `id`, `nombre`, `tipo` y `precio`.
    - Valida que no haya un producto con el mismo `id` para evitar duplicados.

  4. DELETE /product:
    - Elimina un producto enviando su `id` en el cuerpo de la solicitud.

  Si el servidor recibe una solicitud con un método o ruta no soportada, debe devolver un error 404.

  Instrucciones:
    1. Implementa el servidor en Deno que escuche en el puerto 3000.
    2. Crea las rutas `/products` y `/product`, manejando los métodos GET, POST, y DELETE.
    3. Asegúrate de validar que el `id` del producto sea único al añadirlo, y responde con los códigos de estado HTTP correspondientes (200, 400, 404, 409).
*/

type Producto = {
  id: string,
  nombre: string,
  tipo: string
  precio: number
}

let productos: Producto[] = [
  {id: "1", nombre: "iPhone 16", tipo: "movil", precio: 1000},
  {id: "2", nombre: "iPad Pro", tipo: "iPad", precio: 800},
  {id: "3", nombre: "MacBook Pro 16", tipo: "pc", precio: 2400},
  {id: "4", nombre: "Smart Watch Series 8", tipo: "reloj inteligente", precio: 400},
  {id: "5", nombre: "iPhone 14", tipo: "movil", precio: 650}
]

const handler = async (req: Request): Promise<Response> => {
  //Elementos requests
  const metodo = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  //METODOS
  //METODO GET
  if(metodo === "GET"){
    //PATH /productos
    if(path === "/productos"){
      const tipo = url.searchParams.get("tipo");
      if(!tipo) return new Response(JSON.stringify(productos), {status: 200});
      else{
        const result = productos.filter((elem: Producto) => elem.tipo === tipo);
        if(result.length === 0) return new Response("Products not found", {status: 404});
        else return new Response(JSON.stringify(result), {status: 200});
      }
    }
    //PATH /producto
    else if(path === "/producto"){
      const id = url.searchParams.get("id");
      if(!id) return new Response("Bad request", {status: 400});
      else{
        const result = productos.filter((elem: Producto) => elem.id === id);
        if(result.length === 0) return new Response("Products not found", {status: 404});
        else return new Response(JSON.stringify(result), {status: 200});
      }
    }
    else return new Response("Bad request", {status: 400});
  }
  //METODO POST
  else if(metodo === "POST"){
    if(path === "/producto"){
      const producto: Producto = await req.json();
      if(!producto.id || !producto.nombre || !producto.tipo || !producto.precio) return new Response("Faltan parametros", {status: 400});
      else{
        if(productos.find((elem: Producto) => elem.id === producto.id)) return new Response("Ya existe un producto con el ID: " + producto.id, {status: 409});
        else{
          productos.push({id: producto.id, nombre: producto.nombre, tipo: producto.tipo, precio: producto.precio});
          return new Response("Producto añadido", {status: 200});
        }
      }
    }
    else return new Response("Bad request", {status: 400});
  }
  else if(metodo === "DELETE"){
    if(path === "/producto"){
      const producto: Producto = await req.json();
      if(!producto.id) return new Response("Faltan parametros", {status: 400});
      else{
        if(!productos.find((elem: Producto) => elem.id === producto.id)) return new Response("Products not found", {status: 404});
        else{
          productos = productos.filter((elem: Producto) => elem !== (productos.find((elem: Producto) => elem.id === producto.id)));
          return new Response("Producto borrado", {status: 200});
        }
      }
    }
    else return new Response("Bad request", {status: 400});
  }
  return new Response("Method not found", {status: 404});
}

Deno.serve({port: 3000}, handler);
