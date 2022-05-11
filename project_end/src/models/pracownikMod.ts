export type Pracownik = {
  id: {
    type: number;
    required: true;
  };
  imie: {
    type: string;
    required: true;
  };
  nazwisko: {
    type: string;
    required: true;
  };
  stanowisko: {
    type: string;
    required: true;
  };
};
