import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/db.service";
import Rezerwacja from "../models/rezerwacjaModel";
import Validator from "../services/validator";

const router = express.Router();
export default router;

router.use(express.json());

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rezerwacja = (await collections?.rezerwacja
      ?.find({})
      .toArray()) as unknown as Rezerwacja[];

    res.status(200).send(rezerwacja);
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const rezerwacja = (await collections?.rezerwacja?.findOne({
      _id: new ObjectId(id),
    })) as unknown as Rezerwacja;

    if (rezerwacja) {
      res.status(200).send(rezerwacja);
    } else {
      res.status(404).send("Nie znaleziono rezerwacji z takim id");
    }
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const input = req.body as Rezerwacja;

    let result = await Validator.ValidatorRezerwacja(input);

    if (result) {
      res.status(400).send(result);
    } else {
      const rezerwacja: Rezerwacja = {
        table: new ObjectId(input.table),
        dateStart: new Date(
          new Date(input.dateStart).setHours(
            new Date(input.dateStart).getHours() + 2
          )
        ),
        dateEnd: new Date(
          new Date(input.dateEnd).setHours(
            new Date(input.dateEnd).getHours() + 2
          )
        ),
        customer: input.customer,
        seats: input.seats,
        phone: input.phone,
      };

      result = await collections?.rezerwacja?.insertOne(rezerwacja);
    }

    result
      ? res.status(201).send(result.insertedId)
      : res.status(404).send("Nie udało się dodać dania");
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedRezerwacja: Rezerwacja = req.body as Rezerwacja;

    const result = await collections?.rezerwacja?.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedRezerwacja }
    );

    result
      ? res.status(200).send(result)
      : res.status(404).send("Nie udało się zaktualizować rezerwacji");
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await collections?.rezerwacja?.deleteOne({
      _id: new ObjectId(id),
    });

    if (result && result.deletedCount) {
      res.status(202).send("Usunięto rezerwacje");
    } else if (!result?.deletedCount) {
      res.status(404).send("Nie znaleziono rezerwacji z podanym id");
    } else {
      res.status(400).send("Nie udało się usunąć rezerwacji");
    }
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});
