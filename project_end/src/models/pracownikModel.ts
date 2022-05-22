import { ObjectId } from "mongodb";

export default class Pracownik {
  constructor(
    public name: string,
    public surname: string,
    public position: string,
    public id: ObjectId
  ) {}
}
