import { assertEquals } from "https://deno.land/std@0.158.0/testing/asserts.ts";
import {  ConvertirNumber, ArrayFlat, ConvertirArrNumber, TransformarArraySinFallas } from "./main.ts";

Deno.test(function test1() {
  assertEquals(ConvertirNumber("5"), 5);
});
Deno.test(function test2(){
  const miarray=[2,3,4,"5",[2,3]]
  assertEquals(ArrayFlat(miarray) , miarray.flat(Number.MAX_VALUE))
})
Deno.test(function test3(){
  const miarrayStringNumber=[2,3,4,5,"6",7,"8",2,"9"];
  const miarrayNumber:number[]=ConvertirArrNumber(miarrayStringNumber);
  miarrayNumber.forEach(element => {
    assertEquals(typeof(element),"number")
  });
})
Deno.test(function test4(){
  const miarray=[1,2,3,4,5,6,2,1,5,6]
    assertEquals(miarray.length,TransformarArraySinFallas(miarray).length)
})
