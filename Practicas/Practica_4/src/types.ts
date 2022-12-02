export type Coche = {
  id: string;
  matricula:string;
  color:string;
  puertas:number;
  modelo:string;
  marca:string
  precio:number
};
export type Vendedor={
  id:string;
  nombre:string;
  apellido:string;
  telefono:string;
  correo:string;
  coches?:[Coche]
}
export type Concesionario={
  id:string;
  nombre:string;
  pais:string
  telefono:string;
  nombre_dueno:string
  vendedores?:[Vendedor]
}