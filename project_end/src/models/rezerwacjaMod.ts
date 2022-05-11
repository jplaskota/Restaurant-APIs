import { Stolik } from "./stolikMod";

export type Rezerwacja = {
  id: {
    type: number;
    required: true;
  };
  stolik: {
    type: Stolik;
    required: true;
  };
  start: {
    type: Date;
    required: true;
  };
  koniec: {
    type: Date;
    required: true;
  };
  klient: {
    type: string;
    required: true;
  };
  telefon: {
    type: string;
    required: false;
    default: "n/a";
  };
};
