import { ObjectId } from "mongodb";

export default class Stolik {
  constructor(
    public name: string,
    public seats: string,
    public status: string,
    public id?: ObjectId
  ) {}
}
