import { ContactoModel, Contacto, APIWorldTime } from "./types.ts";

export const fromModelToContacto = async (model: ContactoModel): Promise<Contacto> => ({
    id: model._id!.toString(),
    name: model.name,
    last_name: model.last_name,
    phone: model.phone,
    country: model.country,
    timezone: model.timezone,
    datetime: await getDateTime(model)
});

const getDateTime = async (parent: ContactoModel): Promise<string> => {
    const API_KEY = Deno.env.get("API_KEY");
    if (!API_KEY) throw new Error("ERROR: No se ha obtenido la API KEY de la API Ninja");

    const url = `https://api.api-ninjas.com/v1/worldtime?timezone=${parent.timezone}`;
    const data = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY
        }
    });
    if(data.status !== 200) throw new Error("ERROR: No se ha obtenido la DATA de la API Ninja");

    const response: APIWorldTime = await data.json();
    const datetime = response.datetime;
    return datetime;
}