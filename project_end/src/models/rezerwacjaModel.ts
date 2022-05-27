import { ObjectId } from "mongodb";

export default class Rezerwacja {
  constructor(
    public table: ObjectId,
    public dateStart: Date,
    public dateEnd: Date,
    public seats: number,
    public customer: string,
    public phone: string
  ) {}
}
