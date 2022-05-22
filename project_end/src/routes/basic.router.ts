import express, { Request, Response } from "express";

const router = express.Router();
export default router;

router.use(express.json());

router.get("/", async (_req: Request, res: Response) => {
  try {
    res.status(200).send("PABE final project");
  } catch (error) {
    let errorMessage = "Błąd";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).send(errorMessage);
  }
});
