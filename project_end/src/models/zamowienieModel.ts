import { ObjectId } from "mongodb";
import Pracownik from "./pracownikModel";
import Danie from "./danieModel";
import Produkt from "./produktModel";
import Stolik from "./stolikModel";

export default class Zamowienie {
  constructor(
    public orderDate: Date,
    public orderType: string,
    public employee: Pracownik,
    public status: string,
    public price: number,
    public address?: string,
    public dish?: Danie[],
    public product?: Produkt[],
    public table?: Stolik,
    public id?: ObjectId
  ) {}
}
