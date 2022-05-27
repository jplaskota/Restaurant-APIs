import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/db.service";
import Produkt from "../models/produktModel";
import Validator from "../services/validator";

const router = express.Router();
export default router;

router.use(express.json());

router.get("/", async (_req: Request, res: Response) => {
  try {
    const produkt = (await collections?.produkt
      ?.find({})
      .toArray()) as unknown as Produkt[];

    res.status(200).send(produkt);
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
    const produkt = (await collections?.produkt?.findOne({
      _id: new ObjectId(id),
    })) as unknown as Produkt;

    if (produkt) {
      res.status(200).send(produkt);
    } else {
      res.status(404).send("Nie znaleziono produktu z takim id");
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
    const produkt = req.body as Produkt;

    let result = await Validator.ValidatorProdukt(produkt);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.produkt?.insertOne(produkt);
    }

    result
      ? res.status(201).send(result.insertedId)
      : res.status(404).send("Nie udało się dodać produktu");
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
    const produkt = req.body as Produkt;

    let result = await Validator.ValidatorProdukt(produkt);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.produkt?.updateOne(
        { _id: new ObjectId(id) },
        { $set: produkt }
      );

      result
        ? res.status(200).send("Udało się zaktualizować produktu")
        : res.status(404).send("Nie udało się zaktualizować produktu");
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

    const result = await collections?.produkt?.deleteOne({
      _id: new ObjectId(id),
    });

    if (result && result.deletedCount) {
      res.status(202).send("Usunięto produkt");
    } else if (!result?.deletedCount) {
      res.status(404).send("Nie znaleziono produktu z podanym id");
    } else {
      res.status(400).send("Nie udało się usunąć produktu");
    }
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});
