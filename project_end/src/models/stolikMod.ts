export type Stolik = {
  id: {
    type: number;
    required: true;
  };
  nazwa: {
    type: string;
    required: true;
  };
  iloscOsob: {
    type: number;
    required: true;
  };
  status: {
    type: string;
    required: true;
    enum: ["wolny", "zajety", "niedostepny"];
    default: "wolny";
  };
};
