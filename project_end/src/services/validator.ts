import { collections } from "./db.service";
import Pracownik from "../models/pracownikModel";
import Danie from "../models/danieModel";
import Produkt from "../models/produktModel";
import Stolik from "../models/stolikModel";
import Rezerwacja from "../models/rezerwacjaModel";
import { ObjectId } from "mongodb";
export default class Validator {
  public static async ValidatorDanie(danie: any): Promise<any> {
    const errors: string[] = [];

    /// exists
    const danieExists = await collections?.danie?.findOne(danie);

    if (danieExists !== null) {
      const info: any = {};
      info.err = "Dish already exists";
      errors.push(info);
    }

    /// name
    errors.push(Validator.Text(danie.name, "Name"));

    /// price
    errors.push(Validator.Number(danie.price, "Price"));

    /// category
    enum Category {
      "vege",
      "meat",
      "fish",
      "other",
    }

    errors.push(Validator.Category(danie.category, Category, "Category"));

    /// description
    errors.push(Validator.Text(danie.description, "Description"));

    /// if error
    if (errors.some((error: any) => error?.err.length !== undefined)) {
      return errors;
    }
  }

  public static async ValidatorPracownik(pracownik: any): Promise<any> {
    const errors: string[] = [];

    /// exists
    const pracownikExists = await collections?.pracownik?.findOne(pracownik);

    if (pracownikExists !== null) {
      const info: any = {};
      info.err = "Employee already exists";
      errors.push(info);
    }

    /// name
    errors.push(Validator.Text(pracownik.name, "Name"));

    /// surname
    errors.push(Validator.Text(pracownik.surname, "Surname"));

    /// position
    errors.push(Validator.Text(pracownik.position, "Position"));

    /// if error
    if (errors.some((error: any) => error?.err.length !== undefined)) {
      return errors;
    }
  }

  public static async ValidatorProdukt(produkt: any): Promise<any> {
    const errors: string[] = [];

    /// exists
    const produktExists = await collections?.produkt?.findOne(produkt);

    if (produktExists !== null) {
      const info: any = {};
      info.err = "Produkt already exists";
      errors.push(info);
    }

    /// name
    errors.push(Validator.Text(produkt.name, "Name"));

    /// description
    errors.push(Validator.Text(produkt.description, "Description"));

    /// price
    errors.push(Validator.Number(produkt.price, "Price"));

    /// category
    enum Category {
      "juice",
      "soda",
      "beer",
      "normal",
    }

    errors.push(Validator.Category(produkt.category, Category, "Category"));

    /// unit
    errors.push(Validator.Number(produkt.unit, "Unit"));

    /// if error
    if (errors.some((error: any) => error?.err.length !== undefined)) {
      return errors;
    }
  }

  public static async ValidatorRestauracja(restauracja: any): Promise<any> {
    const errors: string[] = [];

    /// exists
    const restauracjaExists = await collections?.restauracja?.findOne(
      restauracja
    );

    if (restauracjaExists !== null) {
      const info: any = {};
      info.err = "Restaurant already exists";
      errors.push(info);
    }

    /// name
    errors.push(Validator.Text(restauracja.name, "Name"));

    /// address
    errors.push(Validator.Text(restauracja.address, "Address"));

    /// phone
    errors.push(Validator.Number(restauracja.phone, "Phone"));

    /// nip
    errors.push(Validator.Number(restauracja.nip, "NIP"));

    /// email
    errors.push(Validator.Text(restauracja.email, "Email"));

    /// www
    errors.push(Validator.Text(restauracja.www, "WWW"));

    /// if error
    if (errors.some((error: any) => error?.err.length !== undefined)) {
      return errors;
    }
  }

  public static async ValidatorRezerwacja(rezerwacja: any): Promise<any> {
    const errors: string[] = [];
    const info: any = {};

    /// exists
    const rezerwacjaExists = await collections?.rezerwacja?.findOne(rezerwacja);

    if (rezerwacjaExists !== null) {
      info.err = "Reservation already exists";
      errors.push(info);
    }

    /// table exists
    if (rezerwacja.table === null) {
      info.err = "Table is required";
      errors.push(info);
    } else {
      const stolikExists = await collections?.stolik?.findOne({
        _id: new ObjectId(rezerwacja.table),
      });

      if (stolikExists === null || stolikExists === undefined) {
        info.err = "Table does not exist";
        errors.push(info);
      } else {
        const stolikStatusList = (await collections?.rezerwacja?.find({
          table: new ObjectId(rezerwacja.table),
        })) as unknown as Rezerwacja[];

        await stolikStatusList.forEach((element) => {
          const eds = element.dateStart.getTime();
          const ede = element.dateEnd.getTime();
          const rds = new Date(
            new Date(rezerwacja.dateStart).setHours(
              new Date(rezerwacja.dateStart).getHours() + 2
            )
          ).getTime();
          const rde = new Date(
            new Date(rezerwacja.dateEnd).setHours(
              new Date(rezerwacja.dateEnd).getHours() + 2
            )
          ).getTime();

          if (
            (eds <= rds && ede >= rds) ||
            (eds <= rde && ede >= rde) ||
            (eds >= rds && ede <= rde)
          ) {
            info.err = "Table is busy";
            errors.push(info);
          }
        });
      }

      if (rezerwacja.seats === null) {
        info.err = "Seats is required";
        errors.push(info);
      } else if (rezerwacja.seats < 1) {
        info.err = "Seats must be greater than 0";
        errors.push(info);
      } else {
        if (stolikExists?.seats < rezerwacja.seats) {
          info.err = "Table is not big enough";
          errors.push(info);
        }
      }
    }

    /// dateStart
    errors.push(Validator.Date(rezerwacja.dateStart, "DateStart"));

    /// dateEnd
    errors.push(Validator.Date(rezerwacja.dateEnd, "DateEnd"));

    /// customer
    errors.push(Validator.Text(rezerwacja.customer, "Customer"));

    /// phone
    errors.push(Validator.Number(rezerwacja.phone, "Phone"));

    /// if error
    if (errors.some((error: any) => error?.err.length !== undefined)) {
      return errors;
    }
  }

  public static async ValidatorStolik(stolik: any): Promise<any> {
    const errors: string[] = [];

    /// exists
    const stolikExists = await collections?.stolik?.findOne(stolik);

    if (stolikExists !== null) {
      const info: any = {};
      info.err = "Table already exists";
      errors.push(info);
    }

    if (stolik.seats < 1) {
      const info: any = {};
      info.err = "Table seats must be greater than 0";
      errors.push(info);
    }

    /// name
    errors.push(Validator.Text(stolik.name, "Name"));
    /// seats
    errors.push(Validator.Number(stolik.seats, "Seats"));

    /// if error
    if (errors.some((error: any) => error?.err.length !== undefined)) {
      return errors;
    }
  }

  public static async ValidatorZamowienie(zamowienie: any): Promise<any> {
    const errors: string[] = [];

    /// exists
    const zamowienieExists = await collections?.zamowienie?.findOne(zamowienie);

    if (zamowienieExists !== null) {
      const info: any = {};
      info.err = "Order already exists";
      errors.push(info);
    }

    /// order type
    enum OrderType {
      "to go",
      "to stay",
    }

    errors.push(
      Validator.Category(zamowienie.orderType, OrderType, "OrderType")
    );

    /// pracownik
    const pracownik = (await collections?.pracownik?.find(
      zamowienie?.pracownik
    )) as unknown as Pracownik;

    if (pracownik === undefined) {
      const info: any = {};
      info.err = "Pracownik not found";
      errors.push(info);
    }

    /// status
    enum Status {
      "ordered",
      "paid",
      "in delivery",
      "delivered",
      "during preparation",
      "canceled",
    }

    errors.push(Validator.Category(zamowienie.status, Status, "Status"));

    /// price
    errors.push(Validator.Number(zamowienie.price, "Price"));

    /// address
    errors.push(Validator.Text(zamowienie.address, "Address"));

    /// dishes exists
    if (zamowienie.dish) {
      const info: any = {};
      zamowienie.dish.forEach(async (element: Danie) => {
        const dishExists = await collections?.danie?.findOne({
          _id: new ObjectId(element._id),
        });
        if (dishExists === null || dishExists === undefined) {
          info.err = "Dish does not exist";
        }
      });
      if (info.err) errors.push(info);
    }

    /// products
    if (zamowienie.product) {
      const info: any = {};
      zamowienie.product.forEach(async (element: Produkt) => {
        const productExists = await collections?.produkt?.findOne({
          _id: new ObjectId(element._id),
        });
        if (productExists === null || productExists === undefined) {
          info.err = "Product does not exist";
        }
      });
      if (info.err) errors.push(info);
    }

    /// table
    if (zamowienie.table) {
      const tableExists = await collections?.stolik?.findOne({
        _id: new ObjectId(zamowienie.table._id),
      });
      if (tableExists === null || tableExists === undefined) {
        const info: any = {};
        info.err = "Table does not exist";
        errors.push(info);
      }
    }

    /// if error
    if (errors.some((error: any) => error?.err.length !== undefined)) {
      return errors;
    }
  }

  public static Text(text: any, nameof: string): any {
    const errors: any = {};

    if (
      nameof === "Name" ||
      nameof === "Surname" ||
      nameof === "Position" ||
      nameof === "Table" ||
      nameof === "Customer" ||
      nameof === "Address"
    ) {
      if (!text) {
        errors.err = nameof + " is required";
        return errors;
      } else if (typeof text !== "string") {
        errors.err = nameof + " must be a string";
        return errors;
      } else if (text.length < 2) {
        errors.err = nameof + " must be at least 3 characters long";
        return errors;
      } else if (text.length > 100) {
        errors.err = nameof + " must be less than 50 characters long";
        return errors;
      } else if (!/^[a-zA-Z0-9 _/ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]+$/.test(text)) {
        errors.err =
          nameof + " can contain only letters, numbers, ' _ , / ' and space";
        return errors;
      }
    } else if (nameof === "Description") {
      if (text) {
        if (typeof text !== "string") {
          errors.err = nameof + " must be a string";
          return errors;
        } else if (text.length < 3) {
          errors.err = nameof + " must be at least 3 characters long";
          return errors;
        } else if (text.length > 100) {
          errors.err = nameof + " must be less than 50 characters long";
          return errors;
        }
      }
    } else if (nameof === "Phone") {
      if (!text) {
        errors.err = nameof + " is required";
        return errors;
      } else if (typeof text !== "string") {
        errors.err = nameof + " must be a string";
        return errors;
      } else if (text.length !== 9) {
        errors.err = nameof + " must be 9 digits long";
        return errors;
      } else if (!/^[0-9]+$/.test(text)) {
        errors.err = nameof + " must contain only digits";
        return errors;
      }
    } else if (nameof === "NIP") {
      if (!text) {
        errors.err = nameof + " is required";
        return errors;
      } else if (typeof text !== "string") {
        errors.err = nameof + " must be a string";
        return errors;
      } else if (text.length !== 10) {
        errors.err = nameof + " must be 10 digits long";
        return errors;
      } else if (!/^[0-9]+$/.test(text)) {
        errors.err = nameof + " must contain only digits";
        return errors;
      }
    } else if (nameof === "Email") {
      if (!text) {
        errors.err = nameof + " is required";
        return errors;
      } else if (typeof text !== "string") {
        errors.err = nameof + " must be a string";
        return errors;
      } else if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          text
        )
      ) {
        errors.err = nameof + " is invalid";
        return errors;
      }
    } else if (nameof === "WWW") {
      if (!text) {
        errors.err = nameof + " is required";
        return errors;
      } else if (typeof text !== "string") {
        errors.err = nameof + " must be a string";
        return errors;
      } else if (
        !/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
          text
        )
      ) {
        errors.err = nameof + " is invalid";
        return errors;
      }
    }
  }

  public static Number(num: any, nameof: string): any {
    const errors: any = {};

    if (!num) {
      errors.err = nameof + " is required";
      return errors;
    } else if (isNaN(parseInt(num))) {
      errors.err = nameof + " must be a number";
      return errors;
    } else if (parseInt(num) < 0) {
      errors.err = nameof + " must be greater than 0";
      return errors;
    }
  }

  public static Category(text: any, ctg: any, nameof: string): any {
    const errors: any = {};

    if (!text) {
      errors.err = nameof + " is required";
      return errors;
    }
    if (!Object.values(ctg).includes(text.toLowerCase())) {
      const val = Object.keys(ctg).filter((v) => isNaN(Number(v)));
      errors.err = nameof + " must be one of the following: " + val.join(", ");
      return errors;
    }
  }

  public static Date(date: any, nameof: string): any {
    const errors: any = {};

    if (!date) {
      errors.err = nameof + " is required";
      return errors;
    }
    if (typeof date !== "string") {
      errors.err = nameof + " must be a string";
      return errors;
    }
    if (!/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})?$/.test(date)) {
      errors.err =
        nameof + " must be in the format YYYY-MM-DD + 'T' + HH:MM:SSS + 'Z'";
      return errors;
    }
  }
}
