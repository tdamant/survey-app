import {Handler} from "../server";
import {Store} from "../store/SurveyResponseStore";
import {Req} from "http4js/core/Req";
import {Res, ResOf} from "http4js/core/Res";
import {Question} from "../../sharedTypes";

export class QuestionHandler implements Handler {
  constructor(private questionStore: Store<Question>) {}

  async handle(req: Req): Promise<Res> {
    try {
      const question = await this.questionStore.find();
      if(question) {
        return ResOf(200, JSON.stringify({question}))
      }
      return ResOf(500, JSON.stringify({error: `failed to get question from db`}));
    } catch(e) {
      return ResOf(500, JSON.stringify({error: `error getting question: ${e.message}`}))
    }

  };
}