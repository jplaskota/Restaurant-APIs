import { ObjectId } from "mongodb";

export default class Restauracja {
  constructor(
    public name: string,
    public address: string,
    public phone: string,
    public nip: string,
    public email: string,
    public www?: string,
    public _id?: ObjectId
  ) {}
}
