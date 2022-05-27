import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/db.service";
import Pracownik from "../models/pracownikModel";
import Validator from "../services/validator";

const router = express.Router();
export default router;

router.use(express.json());

router.get("/", async (_req: Request, res: Response) => {
  try {
    const pracownik = (await collections?.pracownik
      ?.find({})
      .toArray()) as unknown as Pracownik[];

    res.status(200).send(pracownik);
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
    const pracownik = (await collections?.pracownik?.findOne({
      _id: new ObjectId(id),
    })) as unknown as Pracownik;

    if (pracownik) {
      res.status(200).send(pracownik);
    } else {
      res.status(404).send("Nie znaleziono pracownika z takim id");
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
    const pracownik = req.body as Pracownik;

    let result = await Validator.ValidatorPracownik(pracownik);
    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.pracownik?.insertOne(pracownik);
    }

    result
      ? res.status(201).send(result.insertedId)
      : res.status(404).send("Nie udało się dodać pracownika");
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
    const updatedPracownik = req.body as Pracownik;

    let result = await Validator.ValidatorPracownik(updatedPracownik);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.pracownik?.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedPracownik }
      );
      result
        ? res.status(200).send("Udało się zaktualizować pracownika")
        : res.status(404).send("Nie udało się zaktualizować pracownika");
    }
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

    const result = await collections?.pracownik?.deleteOne({
      _id: new ObjectId(id),
    });

    if (result && result.deletedCount) {
      res.status(202).send("Usunięto pracownika");
    } else if (!result?.deletedCount) {
      res.status(404).send("Nie znaleziono pracownika o podanym id");
    } else {
      res.status(400).send("Nie udało się usunąć pracownika");
    }
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});
