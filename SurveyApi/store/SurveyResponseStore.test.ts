import {expect} from "chai";
import {Db} from "mongodb";
import {SurveyResponseStore} from "./SurveyResponseStore";
import {SurveyResponse} from "../../sharedTypes";

const MongoClient = require('mongodb').MongoClient;

describe('SurveyResponseStore', () => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'survey';
  let db: Db;
  let client: any;

  before(async () => {
    client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    const collections = await db.collections();
    const responsesCollection = collections.find(collection => collection.collectionName === 'responses');
    if(responsesCollection) {
      await db.collection('responses').drop()
    }
    await db.createCollection('responses');
  });

  afterEach(async() => {
    await db.collection('responses').drop();
    await client.close();
  });

  it('finds all survey response', async() => {
    const existingResponses: SurveyResponse[] = [
      {selectedOption: 'option 1', emailAddress: 'fake@email.com', comment: 'here is a comment'},
      {selectedOption: 'option 2', emailAddress: 'test@email.com', comment: 'second comment'}
      ];

    const responsesToInsert = existingResponses.map(response => ({...response}));
    await db.collection('responses').insertMany(responsesToInsert);
    const responsesStore = new SurveyResponseStore(db);
    const foundResponses = await responsesStore.findAll();
    expect(foundResponses).to.eql(existingResponses)
  })
});