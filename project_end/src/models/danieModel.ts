import { ObjectId } from "mongodb";
import Validator from "../services/validator";

export default class Danie {
  constructor(
    public name: string,
    public price: number,
    public category: string,
    public description?: string,
    public id?: ObjectId
  ) {}
}
