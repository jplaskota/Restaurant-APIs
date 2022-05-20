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
