import {SurveyForm} from "../components/SurveyForm";
import React, {Fragment, useEffect, useState} from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {GroupedResponses, Question, SurveyResponse} from "../../../sharedTypes";
import {BarLoader} from "react-spinners";
import {ErrorDisplay} from "../components/ErrorDisplay";
import {LinkButton} from "../components/LinkButton";

const ViewResults = styled.button`
  width: 150px;
  background-color: #f0f6f7;
  color: #5c6263;
  border-radius: 4px;
  margin: 0 auto;s
  height: 30px;
`;

const Container = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 400px;
`;

type SurveyPageProps = {
  saveResponseFn: (response: SurveyResponse) => Promise<{ error?: string, responses: GroupedResponses }>
  getQuestionFn: () => Promise<{question: Question, error?: string}>;
};

export const SurveyPage = ({saveResponseFn, getQuestionFn}: SurveyPageProps) => {
  const history = useHistory();
  const [question, setQuestion] = useState<Question>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();


  const getQuestion = async() => {
    const apiResponse = await getQuestionFn();
    setIsLoading(false);
    if(apiResponse.error) {
      setError(new Error(apiResponse.error));
      return
    }
    setQuestion(apiResponse.question)
  };

  useEffect(() => {
      setTimeout(() => {
        getQuestion()
      }, 500)
  },[]);

  return (
    <Container>
      {isLoading ? <BarLoader css={'margin: auto;'}/> :
        <Fragment>
          {question && <SurveyForm saveResponseFn={saveResponseFn} question={question}/>}
          {error && <ErrorDisplay displayMessage={'There was an error please try again later'}/>}
          <LinkButton text={'View results'}  onClick={() => {
            history.push('/results')
          }}/>
        </Fragment>
      }
    </Container>

  )
};