import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/db.service";
import Stolik from "../models/stolikModel";
import Validator from "../services/validator";

const router = express.Router();
export default router;

router.use(express.json());

router.get("/", async (_req: Request, res: Response) => {
  try {
    const stolik = (await collections?.stolik
      ?.find({})
      .toArray()) as unknown as Stolik[];

    res.status(200).send(stolik);
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
    const stolik = (await collections?.stolik?.findOne({
      _id: new ObjectId(id),
    })) as unknown as Stolik;

    if (stolik) {
      res.status(200).send(stolik);
    } else {
      res.status(404).send("Nie znaleziono stolika z takim id");
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
    const stolik = req.body as Stolik;

    let result = await Validator.ValidatorStolik(stolik);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.stolik?.insertOne(stolik);
    }

    result
      ? res.status(201).send(result.insertedId)
      : res.status(404).send("Nie udało się dodać stolika");
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
    const stolik = req.body as Stolik;

    let result = await Validator.ValidatorStolik(stolik);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.stolik?.updateOne(
        { _id: new ObjectId(id) },
        { $set: stolik }
      );

      result
        ? res.status(200).send("Udało się zaktualizować stolika")
        : res.status(404).send("Nie udało się zaktualizować stolika");
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

    const result = await collections?.stolik?.deleteOne({
      _id: new ObjectId(id),
    });

    if (result && result.deletedCount) {
      res.status(202).send("Usunięto stolik");
    } else if (!result?.deletedCount) {
      res.status(404).send("Nie znaleziono stolika z podanym id");
    } else {
      res.status(400).send("Nie udało się usunąć stolika");
    }
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});
