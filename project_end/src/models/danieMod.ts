export type Danie = {
  id: {
    type: number;
    required: true;
  };
  nazwa: {
    type: string;
    required: true;
  };
  opis: {
    type: string;
    required: false;
    default: "n/a";
  };
  cena: {
    type: number;
    required: true;
  };
  kategoria: {
    type: string;
    required: true;
    enum: ["Kebab", "Burger", "Pizza", "Kanapka"];
  };
};
