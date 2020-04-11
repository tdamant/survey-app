import {Handler} from "../server";
import {Req} from "http4js/core/Req";
import {Res, ResOf} from "http4js/core/Res";
import {Store} from "../store/SurveyResponseStore";
import {GroupedResponses, SurveyResponse} from "../../sharedTypes";
import {Method} from "http4js/core/Methods";

export class ResponseHandler implements Handler {
  constructor(private surveyResponseStore: Store<SurveyResponse>) {}
  async handle(req: Req): Promise<Res> {
    if(req.method === Method.GET) {
      return this.getResponses()
    }

    if(req.method === Method.POST) {
      return this.saveAndGetResponses(req);
    }
    return ResOf(404)
  };

  async getResponses(): Promise<Res> {
    try{
      const groupedResponses = await this.findAllResponses();
      return ResOf(200, JSON.stringify({responses: groupedResponses}))
    } catch(e) {
      return ResOf(500, JSON.stringify({error: e.message}))
    }
  }

  async saveAndGetResponses(req: Req): Promise<Res> {
    try{
      const surveyResponse = JSON.parse(req.bodyString());

      const saved = await this.surveyResponseStore.store(surveyResponse);
      if(saved) {
        return await this.getResponses();
      }
      return ResOf(500, JSON.stringify({error: 'error saving response'}))
    } catch(e) {
      return ResOf(500, JSON.stringify({error: e.message}))
    }
  }

  private async findAllResponses(): Promise<GroupedResponses> {
    const responses = await this.surveyResponseStore.findAll();
    return this.groupByEmail(responses)
  }

  private groupByEmail(surveyResponses: SurveyResponse[]): GroupedResponses {
    return surveyResponses.reduce((grouped, response) => {
      const answer = {selectedOption: response.selectedOption, comment: response.comment};
      if(grouped[response.emailAddress]) {
        grouped[response.emailAddress] = [...grouped[response.emailAddress], answer];
        return grouped
      }
      grouped[response.emailAddress] = [answer];
      return grouped
    }, {} as GroupedResponses)
  }
}