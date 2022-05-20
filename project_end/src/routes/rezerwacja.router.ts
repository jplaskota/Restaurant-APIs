import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/db.service";
import Danie from "../models/danieModel";

const router = express.Router();
export default router;

router.use(express.json());

router.get("/", async (_req: Request, res: Response) => {
  try {
    const danie = (await collections?.danie
      ?.find({})
      .toArray()) as unknown as Danie[];

    res.status(200).send(danie);
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
    const danie = (await collections?.danie?.findOne({
      _id: new ObjectId(id),
    })) as unknown as Danie;

    if (danie) {
      res.status(200).send(danie);
    } else {
      res.status(404).send("Nie znaleziono dania z takim id");
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
    const danie = req.body as Danie;

    const result = await collections?.danie?.insertOne(danie);

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
    const updatedDanie: Danie = req.body as Danie;

    const result = await collections?.danie?.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedDanie }
    );

    result
      ? res.status(200).send(result)
      : res.status(404).send("Nie udało się zaktualizować dania");
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

    const result = await collections?.danie?.deleteOne({
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