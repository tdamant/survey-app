import React, {Fragment, useEffect, useState} from "react";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {LinkButton} from "../components/LinkButton";
import {GroupedResponses} from "../../../sharedTypes";
import {DisplayResponses} from "../components/DisplayResponses";
import {BarLoader} from "react-spinners";
import {ErrorDisplay} from "../components/ErrorDisplay";

const ResponsesPageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export type ResponsesPageProps = {
  getResponsesFn: () => Promise<{ responses: GroupedResponses, error?: string }>
}

export function ResponsesPage({getResponsesFn}: ResponsesPageProps) {
  const history = useHistory();
  const [responses, setResponses] = useState<GroupedResponses>({});
  const [apiError, setApiError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    setApiError('');
    const responseFromApi = await getResponsesFn();
    setIsLoading(false);
    if (responseFromApi.error) {
      setApiError(responseFromApi.error)
    }
    setResponses(responseFromApi.responses);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      getData()
    }, 500)
  }, []);
  return (
    <ResponsesPageContainer>
      {isLoading ? <BarLoader css={'margin: auto;'}/> :
        <Fragment>
          {apiError ?
            <ErrorDisplay displayMessage={'There was an error getting the responses please try again later'}/> :
            <Fragment>
              <DisplayResponses allResponses={responses}/>
            </Fragment>
          }
          <LinkButton onClick={() => history.push('/')} text={'Complete Survey!'}/>
        </Fragment>
      }
    </ResponsesPageContainer>
  )
}