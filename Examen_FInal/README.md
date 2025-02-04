# NOTA
8,8

---------------

# ASPECTOS A TENER EN CUENTA

## addRestaurant
No se debe conectar correctamente a la API 'https://api.api-ninjas.com/v1/city', debido a que cuando intento tomar los datos de los parametros *latitude* y *longitude*, 
por alguna razón no los coge, el tipo de dato que se almacena en BBDD para esos valores es **UNDEFINED**.

```TypeScript
//API City
const url_city = `https://api.api-ninjas.com/v1/city?name=${ciudad}`
const data_city = await fetch(url_city, {
    headers: {
        'X-Api-Key': API_KEY
    }
});
if(data_city.status !== 200) throw new GraphQLError("ERROR: No se ha conectado correctamente a la API City");
const response_city: APICity = await data_city.json();
const latitud = response_city.latitude; //Por alguna razón, es valor es 'undefined'
const longitud = response_city.longitude; //Por alguna razón, es valor es 'undefined'
//console.log("Latitud: ", latitud);
//console.log("Longitud: ", longitud);
```
## ALTERNATIVA
Las querys **getRestaurants** y **getRestaurant** funcionan correctamente, pero claro, si en la BBDD el Restaurante tiene los valores *latitud* y *longitud* nulos, 
no es posible determinar la **temperatura_actual** ni la **hora_local** del Restaurante, ya que para obtener estos datos, utilizo los dos parametros anteriores.

Debido a eso, he creado manualmente dos Restaurante en la BBDD para poder introducir la *latitud* y la *longitud*, podrás comprobar que en ese caso **se devuelven 
correctamente todos los atributos** solicitados en el enunciado.

### RESPUESTAS
Respuesta al llamar a la query getRestaurants(ciudad: "Madrid) cuyos Restaurantes tienen **latitud** y **longitud**:
```JSON
{
  "data": {
    "getRestaurants": [
      {
        "id": "679cedfcac1b8a2d3032ad02",
        "nombre": "VIPS",
        "direccion_restaurante": "Gran Via, 1, Madrid, Spain",
        "telefono": "+34987654321",
        "temperatura_actual": "11",
        "hora_local": "17:31"
      },
      {
        "id": "679cf0bbac1b8a2d3032ad03",
        "nombre": "Ginos",
        "direccion_restaurante": "Calle Cristina Oria, 3, Madrid, Spain",
        "telefono": "+34987654322",
        "temperatura_actual": "11",
        "hora_local": "17:31"
      }
    ]
  }
}
```
-----------------

Respuesta al llamar a la query getRestaurants(ciudad: "Leon") cuyos Restaurantes no tienen **latitud** y **longitud** (valor nulos, al crearlos usando el resolver 
addRestaurant):
```JSON
{
  "errors": [
    {
      "message": "ERROR: No se ha conectado correctamente a la API World Time",
      "locations": [
        {
          "line": 8,
          "column": 5
        }
      ],
      "path": [
        "addRestaurant",
        "hora_local"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "stacktrace": [
          "GraphQLError: ERROR: No se ha conectado correctamente a la API World Time",
          "    at Object.hora_local (file:///Users/davidarevalo/Library/Mobile Documents/com~apple~CloudDocs/Nebrija/5º Año/1er Semestre/Backend/Examen final GRAPHQL/resolvers.ts:125:53)",
          "    at eventLoopTick (ext:core/01_core.js:175:7)"
        ]
      }
    }
  ],
  "data": null
}
```
