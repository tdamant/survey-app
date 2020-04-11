import {Server} from "./server";
import {ResponseHandler} from "./handlers/ResponseHandler";
import {createDB} from "./db/createDB";
import {SurveyResponseStore} from "./store/SurveyResponseStore";
import {QuestionStore} from "./store/QuestionStore";
import {QuestionHandler} from "./handlers/QuestionHandler";

const start = async () => {
  const db = await createDB('mongodb://localhost:27017', 'survey', ['responses', 'questions']);
  const surveyResponseStore = new SurveyResponseStore(db);
  const questionStore = new QuestionStore(db);
  const responseHandler = new ResponseHandler(surveyResponseStore);
  const questionHandler = new QuestionHandler(questionStore);
  const server = new Server(responseHandler, questionHandler);
  await server.start()
};

start();
