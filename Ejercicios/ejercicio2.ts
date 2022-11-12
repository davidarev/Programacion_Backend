const obj = {
    name: "David",
    edad: 20,
    amigos: ["Santi", "Valentin", "Marcos"],
    padres: [
        {key: "Padre", value: "Jorge"},
        {key: "Madre", value: "Rut"}
    ]
}

const objectToString = (obj: unknown): string => {
  if (typeof obj === "string") return `"${obj}"`;
  if (typeof obj === "number") return `${obj}`;
  if (typeof obj === "boolean") return `${obj}`;
  if (obj === null) return "null";
  if (Array.isArray(obj)) return `[${obj.map(objectToString).join(",")}]`;
  if (typeof obj === "object") {
    const ret = Object.keys(obj).reduce((acc, key) => {
      return `${acc}"${key}":${objectToString(obj[key])},`;
    }, "{");
    return `${ret.slice(0, -1)}}`;
  }
  return "";
};

console.log(objectToString(obj));
console.log(JSON.stringify(obj));

// check if it works
console.log(objectToString(obj) === JSON.stringify(obj));