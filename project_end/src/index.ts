import express from "express";
import { connectToDatabase } from "./services/db.service";
import dania from "./routes/dania.router";
import pracownicy from "./routes/pracownik.router";
import produkt from "./routes/produkt.router";
import restauracje from "./routes/restauracja.router";
import rezerwacje from "./routes/rezerwacja.router";
import stoliki from "./routes/stolik.router";
import zamowienia from "./routes/zamowienie.router";
import basic from "./routes/basic.router";

const app = express();
app.use(express.json());
const port = 3000;

connectToDatabase()
  .then(() => {
    app.use("/dania", dania);
    app.use("/pracownicy", pracownicy);
    app.use("/produkt", produkt);
    app.use("/restauracje", restauracje);
    app.use("/rezerwacje", rezerwacje);
    app.use("/stoliki", stoliki);
    app.use("/zamowienia", zamowienia);
    app.use("/", basic);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
