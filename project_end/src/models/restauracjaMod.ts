export type Restauracja = {
  id: {
    type: number;
    required: true;
  };
  nazwa: {
    type: string;
    required: true;
  };
  adres: {
    type: string;
    required: true;
  };
  telefon: {
    type: string;
    required: true;
  };
  nip: {
    type: string;
    required: true;
  };
  email: {
    type: string;
    required: true;
  };
  www: {
    type: string;
    required: false;
    default: "n/a";
  };
};
