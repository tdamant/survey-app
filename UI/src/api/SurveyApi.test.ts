import {SurveyApi} from "./SurveyApi";

describe('SurveyApi', () => {
  it('gets survey results', async () => {
    const surveyResponses = [
      {selectedOption: 'option 1', emailAddress: 'fake@email.com', comment: 'here is a comment'},
      {selectedOption: 'option 2', emailAddress: 'test@email.com', comment: 'second comment'}
    ];
    const fakeFetch = async (_input: RequestInfo, _options?: RequestInit): Promise<Response> => {
      async function getText() {
        return JSON.stringify({responses: surveyResponses});
      }
      return { status: 200, text: getText } as Response;
    };
    const surveyApi = new SurveyApi('', fakeFetch);
    const responses = await surveyApi.getResponses();
    expect(responses).toEqual({responses: surveyResponses})
  });
  it('returns errors from the api', async () => {
    const fakeFetch = async (_input: RequestInfo, _options?: RequestInit): Promise<Response> => {
      async function getText() {
        return JSON.stringify({error: 'error getting data from db'});
      }
      return { status: 500, text: getText } as Response;
    };
    const surveyApi = new SurveyApi('', fakeFetch);
    const responses = await surveyApi.getResponses();
    expect(responses).toEqual({responses: [], error: 'error getting data from db'})
  });
  it('handles fetch errors', async() => {
    const fakeFetch = async (_input: RequestInfo, _options?: RequestInit): Promise<Response> => {
      throw new Error('failed to fetch')
    };
    const surveyApi = new SurveyApi('', fakeFetch);
    const responses = await surveyApi.getResponses();
    expect(responses).toEqual({responses: {}, error: 'failed to fetch'})
  })
});