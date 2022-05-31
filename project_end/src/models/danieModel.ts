import { ObjectId } from "mongodb";

export default class Danie {
  constructor(
    public name: string,
    public price: number,
    public category: string,
    public description?: string,
    public _id?: ObjectId
  ) {}
}
