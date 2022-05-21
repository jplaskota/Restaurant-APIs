import { ObjectId } from "mongodb";

export default class Stolik {
  constructor(
    public name: string,
    public seats: number,
    public status: string,
    public id?: ObjectId
  ) {}
}
