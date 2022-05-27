import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/db.service";
import Restauracja from "../models/restauracjaModel";
import Validator from "../services/validator";

const router = express.Router();
export default router;

router.use(express.json());

router.get("/", async (_req: Request, res: Response) => {
  try {
    const restauracja = (await collections?.restauracja
      ?.find({})
      .toArray()) as unknown as Restauracja[];

    res.status(200).send(restauracja);
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
    const restauracja = (await collections?.restauracja?.findOne({
      _id: new ObjectId(id),
    })) as unknown as Restauracja;

    if (restauracja) {
      res.status(200).send(restauracja);
    } else {
      res.status(404).send("Nie znaleziono restauracji z takim id");
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
    const restauracja = req.body as Restauracja;

    let result = await Validator.ValidatorRestauracja(restauracja);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.restauracja?.insertOne(restauracja);
    }

    result
      ? res.status(201).send(result.insertedId)
      : res.status(404).send("Nie udało się dodać restauracji");
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
    const restauracja = req.body as Restauracja;

    let result = await Validator.ValidatorRestauracja(restauracja);

    if (result) {
      res.status(400).send(result);
    } else {
      result = await collections?.restauracja?.updateOne(
        { _id: new ObjectId(id) },
        { $set: restauracja }
      );
    }

    result
      ? res.status(200).send("Udało się dodać restauracji")
      : res.status(404).send("Nie udało się zaktualizować restauracji");
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

    const result = await collections?.restauracja?.deleteOne({
      _id: new ObjectId(id),
    });

    if (result && result.deletedCount) {
      res.status(202).send("Usunięto restaurację");
    } else if (!result?.deletedCount) {
      res.status(404).send("Nie znaleziono restauracji z podanym id");
    } else {
      res.status(400).send("Nie udało się usunąć restauracji");
    }
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});
