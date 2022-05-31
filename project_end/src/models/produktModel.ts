import { ObjectId } from "mongodb";

export default class Produkt {
  constructor(
    public name: string,
    public description: string,
    public price: number,
    public category: string,
    public unit: number,
    public _id?: ObjectId
  ) {}
}
