import { Pracownik } from "./pracownikMod";
import { Danie } from "./danieMod";
import { Stolik } from "./stolikMod";

export type Zamowienie = {
  id: {
    type: number;
    required: true;
  };
  dataZamowienia: {
    type: Date;
    required: true;
  };
  rodzajZamowienia: {
    type: string;
    required: true;
    enum: ["Na wynos", "Stolik"];
  };
  pracownik: {
    type: Pracownik;
    required: true;
  };
  pozycja: {
    type: Danie[];
    required: true;
  };
  status: {
    type: string;
    required: true;
    enum: ["Zlozone", "Oczekuje", "Zrealizowane", "Rachunek", "Anulowane"];
    default: "Zlozone";
  };
  stolik: {
    type: Stolik;
    required: false;
  };
  kwota: {
    type: number;
    required: true;
  };
};
