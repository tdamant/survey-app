import styled from "styled-components";
import React from "react";


export const ErrorContainer = styled.div`
  margin: 24px auto;
`;

export const ErrorDisplay = ({displayMessage}: {displayMessage: string}) => {
  return (
    <ErrorContainer>{displayMessage}</ErrorContainer>
  )
};