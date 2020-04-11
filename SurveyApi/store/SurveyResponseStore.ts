import {Db} from "mongodb";
import {SurveyResponse} from "../../sharedTypes";

export interface Store<T> {
  findAll: () => Promise<T[]>
  find:(t?: Partial<T>) => Promise<T>
  store: (t: T) => Promise<T | undefined>
}

export class FakeSurveyResponseStore implements Store<SurveyResponse> {
  constructor(private responses: SurveyResponse[], private error?: Error) {
  }

  async store(response: SurveyResponse): Promise<SurveyResponse | undefined> {
    this.responses.push(response);
    return response
  };


  async findAll(): Promise<SurveyResponse[]> {
    if (this.error) {
      throw this.error
    }
    return this.responses
  } ;

  async find(t?: Partial<SurveyResponse>): Promise<SurveyResponse> {
    throw new Error('method not implemented')
  };
}

export class SurveyResponseStore implements Store<SurveyResponse> {
  constructor(private db: Db, private collectionName = 'responses') {
  }

  async findAll(): Promise<SurveyResponse[]> {
    const docs = await this.db.collection(this.collectionName).find().toArray();
    return docs.map(doc => ({comment: doc.comment, emailAddress: doc.emailAddress, selectedOption: doc.selectedOption}))
  };

  async store(response: SurveyResponse): Promise<SurveyResponse | undefined> {
    const copiedResponse =  {...response};
    const inserted = await this.db.collection(this.collectionName).insertOne(copiedResponse);
    if(inserted.ops[0] == copiedResponse) {
      return inserted.ops[0]
    }
  }

  find(t?: Partial<SurveyResponse>): Promise<SurveyResponse> {
    throw new Error('method not implemented')
  };
}