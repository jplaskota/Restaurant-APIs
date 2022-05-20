import { ObjectId } from "mongodb";
import Stolik from "./stolikModel";

export default class Rezerwacja {
  constructor(
    public table: Stolik,
    public dateStart: Date,
    public dateEnd: Date,
    public customer: string,
    public phone: string,
    public id?: ObjectId
  ) {}
}
