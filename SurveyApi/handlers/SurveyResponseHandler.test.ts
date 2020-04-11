import {ResponseHandler} from "./ResponseHandler";
import {expect} from "chai";
import {ReqOf} from "http4js/core/Req";
import {FakeSurveyResponseStore} from "../store/SurveyResponseStore";

describe('ResponseHandler', () => {
  describe('getResponses', () => {
    it('gets all responses grouped by email', async () => {
      const responses = [
        {comment: 'that was a great Survey!', emailAddress: 'fake@email.com', selectedOption: 'Option 1'},
        {comment: 'this is my second response', emailAddress: 'fake@email.com', selectedOption: 'Option 4'},
        {comment: 'Another comment', emailAddress: 'test@fake.com', selectedOption: 'Option 4'}
      ];
      const surveyResponseStore = new FakeSurveyResponseStore(responses);
      const surveyResponseHandler = new ResponseHandler(surveyResponseStore);
      const req = ReqOf('GET', '/responses');
      const res = await surveyResponseHandler.handle(req);
      expect(res.status).to.eql(200);
      expect(JSON.parse(res.bodyString())).to.eql({
        responses: {
          [responses[0].emailAddress]: [
            {comment: responses[0].comment, selectedOption: responses[0].selectedOption},
            {comment: responses[1].comment, selectedOption: responses[1].selectedOption},
          ]
          ,
          [responses[2].emailAddress]: [
            {comment: responses[2].comment, selectedOption: responses[2].selectedOption}
          ]
        }
      })
    });
    it('handles db errors', async () => {
      const error = new Error('Error getting data from DB');
      const surveyResponseStore = new FakeSurveyResponseStore([], error);
      const surveyResponseHandler = new ResponseHandler(surveyResponseStore);
      const req = ReqOf('GET', '/responses');
      const res = await surveyResponseHandler.handle(req);
      expect(res.status).to.eql(500);
      expect(JSON.parse(res.bodyString())).to.eql({error: error.message})
    })
  });
  describe('saveAndGetResponses', () => {
    it('saves response in DB and then returns all responses', async () => {
      const surveyResponseStore = new FakeSurveyResponseStore([]);
      const surveyResponseHandler = new ResponseHandler(surveyResponseStore);
      const surveyResponse = {emailAddress: 'tom@tom.com', comment: 'hello', selectedOption: 'Option 1'};
      const body = JSON.stringify(surveyResponse);
      const req = ReqOf('POST', '/responses', body);
      const res = await surveyResponseHandler.handle(req);
      expect(res.status).to.eql(200);
      expect(JSON.parse(res.bodyString())).to.eql({
        responses: {
          [surveyResponse.emailAddress]: [
            {comment: surveyResponse.comment, selectedOption: surveyResponse.selectedOption},
          ]
        }
      })

    })
    it('handles insert error', async () => {
      const error = new Error('error inserting');
      const surveyResponseStore = new FakeSurveyResponseStore([], error);
      const surveyResponseHandler = new ResponseHandler(surveyResponseStore);
      const surveyResponse = {emailAddress: 'tom@tom.com', comment: 'hello', selectedOption: 'Option 1'};
      const body = JSON.stringify(surveyResponse);
      const req = ReqOf('POST', '/responses', body);
      const res = await surveyResponseHandler.handle(req);
      expect(res.status).to.eql(500);
      expect(JSON.parse(res.bodyString())).to.eql({
        error: 'error inserting'
      })
    })
  });
});