import * as mongoDB from "mongodb";

export const collections: {
  danie?: mongoDB.Collection;
  pracownik?: mongoDB.Collection;
  produkt?: mongoDB.Collection;
  restauracja?: mongoDB.Collection;
  rezerwacja?: mongoDB.Collection;
  stolik?: mongoDB.Collection;
  zamowienie?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    "mongodb+srv://user:12345@restaurant.p1hyx.mongodb.net/?retryWrites=true&w=majority"
  );

  await client.connect();

  const db: mongoDB.Db = client.db("Restaurant");

  const danieCollection: mongoDB.Collection = db.collection(
    "danie"
  );
  collections.danie = danieCollection;

  const pracownikCollection: mongoDB.Collection = db.collection(
    "pracownik"
  );
  collections.pracownik = pracownikCollection;

  const produktCollection: mongoDB.Collection = db.collection(
    "produkt"
  );
  collections.produkt = produktCollection;

  const restauracjaCollection: mongoDB.Collection = db.collection(
    "restauracja"
  );
  collections.restauracja = restauracjaCollection;

  const rezerwacjaCollection: mongoDB.Collection = db.collection(
    "rezerwacja"
  );
  collections.rezerwacja = rezerwacjaCollection;

  const stolikCollection: mongoDB.Collection = db.collection(
    "stolik"
  );
  collections.stolik = stolikCollection;

  const zamowienieCollection: mongoDB.Collection = db.collection(
    "zamownienie"  );
  collections.zamowienie = zamowienieCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${danieCollection.collectionName}`
  );
}
