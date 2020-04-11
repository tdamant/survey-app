import React from 'react';
import './App.css';
import {BrowserRouter, Route} from "react-router-dom";
import {ResponsesPage} from "./pages/ResponsesPage";
import styled from "styled-components";
import {SurveyPage} from "./pages/SurveyPage";
import {SurveyApi} from "./api/SurveyApi";

const Layout = styled.div`
  max-width: 500px;
  margin: 64px auto;
`;

function App() {
  const api = new SurveyApi();
  const saveResponseFn = api.saveResponse.bind(api);
  const getResponsesFn = api.getResponses.bind(api);
  const getQuestionFn = api.getQuestion.bind(api);
  return (
      <BrowserRouter>
        <Route exact path={'/'}>
          <Layout>
            <SurveyPage saveResponseFn={saveResponseFn} getQuestionFn={getQuestionFn}/>
          </Layout>
        </Route>
        <Route exact path={'/results'}>
          <Layout>
            <ResponsesPage getResponsesFn={getResponsesFn}/>
          </Layout>
        </Route>
      </BrowserRouter>
  );
}

export default App;
