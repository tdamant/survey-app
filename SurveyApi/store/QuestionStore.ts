import {Store} from "./SurveyResponseStore";
import {Db} from "mongodb";
import {Question} from "../../sharedTypes";


export class QuestionStore implements Store<Question> {
  constructor(private db: Db, private collectionName = 'questions') {
  }

  async findAll(): Promise<Question[]> {
    const docs = await this.db.collection(this.collectionName).find().toArray();
    return docs.map(doc => ({question: doc.question, options: doc.options}))
  };

  async store(t: Question): Promise<Question | undefined> {
    throw new Error('Method not implemented')
  };

  async find(t?: Partial<Question>): Promise<Question> {
    const docs = await this.db.collection(this.collectionName).find().toArray();
    return {question: docs[0].question, options: docs[0].options}
  }
}