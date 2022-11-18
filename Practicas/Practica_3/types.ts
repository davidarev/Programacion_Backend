export type User={
    id:string,
    name:string,
    email:string,
    password:string,
    createAt:string,
    cart:[string]
}
export type Book={
    id:string,
    title:string,
    author:string,
    pages:number,
    ISBN:string
}
export type Author={
    id:string,
    name:string,
    books:[string]
}