import { ObjectId } from "mongodb";

export default class Stolik {
  constructor(
    public name: string,
    public seats: number,
    public _id?: ObjectId
  ) {}
}
