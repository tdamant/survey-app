import {Db, MongoClient} from "mongodb";

export const createDB = async (url: string, dbName: string, collectionNames: string[]): Promise<Db> => {
  const client = new MongoClient(url);
  await client.connect();
  const existingDB = client.db(dbName);
  await existingDB.dropDatabase();
  const db = client.db(dbName);
  const collectionsPromises = collectionNames.map((name) => {
    return new Promise((resolve) => resolve(db.createCollection(name)))
  });
  await Promise.all(collectionsPromises);
  await db.collection('questions').insertOne({
    question: 'How often do you cycle to work',
    options: [
      {value: 'Less than once per week'},
      {value: 'Once per week'},
      {value: 'Two times per week'},
      {value: 'Three times per week'},
      {value: 'Four times per week'},
      {value: 'Five or more times per week'},
    ]
  });
  return db
};