import { ObjectId } from "mongodb";

export default class Danie {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public category: string,
    public id?: ObjectId
  ) {}
}

//* old version
/* 
export type Danieee = {
  id: {
    type: number;s
    required: true;
  };
  nazwa: {
    type: string;
    required: true;
  };
  opis: {
    type: string;
    required: false;
    default: "n/a";
  };
  cena: {
    type: number;
    required: true;
  };
  kategoria: {
    type: string;
    required: true;
    enum: ["Kebab", "Burger", "Pizza", "Kanapka"];
  };
};
*/
