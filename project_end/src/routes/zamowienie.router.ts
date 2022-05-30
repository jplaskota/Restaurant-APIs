import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/db.service";
import Zamowienie from "../models/zamowienieModel";
import Validator from "../services/validator";

const router = express.Router();
export default router;

router.use(express.json());

router.get("/", async (_req: Request, res: Response) => {
  try {
    const zamownienie = (await collections?.zamowienie
      ?.find({})
      .toArray()) as unknown as Zamowienie[];

    res.status(200).send(zamownienie);
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
    const zamowienie = (await collections?.zamowienie?.findOne({
      _id: new ObjectId(id),
    })) as unknown as Zamowienie;

    if (zamowienie) {
      res.status(200).send(zamowienie);
    } else {
      res.status(404).send("Nie znaleziono zamownienia z takim id");
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
    const zamowienie = req.body as Zamowienie;

    let result = await Validator.ValidatorZamowienie(zamowienie);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.zamowienie?.insertOne(zamowienie);
    }

    result
      ? res.status(201).send(result.insertedId)
      : res.status(404).send("Nie udało się dodać zamowienia");
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
    const zamowienie = req.body as Zamowienie;

    let result = await Validator.ValidatorZamowienie(zamowienie);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.zamowienie?.updateOne(
        { _id: new ObjectId(id) },
        { $set: zamowienie }
      );
    }
    result
      ? res.status(201).send(result)
      : res.status(404).send("Nie udało się dodać zamowienia");
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

    const result = await collections?.zamowienie?.deleteOne({
      _id: new ObjectId(id),
    });

    if (result && result.deletedCount) {
      res.status(202).send("Usunięto zamówienie");
    } else if (!result?.deletedCount) {
      res.status(404).send("Nie znaleziono zamówienia z podanym id");
    } else {
      res.status(400).send("Nie udało się usunąć zamówienia");
    }
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});
