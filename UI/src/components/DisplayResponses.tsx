import {Answers, GroupedResponses} from "../../../sharedTypes";
import * as React from "react";
import styled from "styled-components";
import {Fragment} from "react";

const DisplayContainer = styled.div`
  margin: 8px;
  text-align: center;
`;

const AnswersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 16px;
  width: 60%;
  grid-gap: 16px;
`;

const GridCell = styled.div<{ columnNumber: number }>`
  grid-column: ${props => props.columnNumber} / ${props => props.columnNumber};
`;

const ResponderContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgb(184, 190, 191);
`;

const NoResults = styled.div`
  margin: auto;
`;

const EmailContainer = styled.div`
  margin: 16px;
  width: 40%;
`;

export const DisplayResponses: React.FC<{ allResponses: GroupedResponses }> = ({allResponses}) => {
  const resultsArray: [string, Answers[]][] = Object.entries(allResponses);
  const headers: [string, Answers[]] = ['', [{selectedOption: 'Selected Option', comment: 'Comment'}]];
  resultsArray.unshift(headers);
  return (
    <Fragment>
      {Object.entries(allResponses).length === 0 ? <NoResults>No results yet - go and submit a response!</NoResults> :
        <DisplayContainer>
          {resultsArray.map(([email, responses]: [string, Answers[]], index) =>
            <ResponderContainer key={index}>
              <EmailContainer>{email}</EmailContainer>
              <AnswersContainer>
                {responses.map((response, index) =>
                  <Fragment key={index}>
                    <GridCell columnNumber={1}>{response.selectedOption}</GridCell>
                    <GridCell columnNumber={2}>{response.comment}</GridCell>
                  </Fragment>
                )}
              </AnswersContainer>
            </ResponderContainer>
          )}
        </DisplayContainer>
      }
    </Fragment>

  )
};