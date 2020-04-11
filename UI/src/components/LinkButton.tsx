import styled from "styled-components";
import React from "react";

const StyledButton = styled.button`
  height: 30px;
  width: 150px;  
  border-radius: 4px;
  margin: 24px auto;
  background-color: #f0f6f7;
  color: #5c6263;
`;

export function LinkButton ({onClick, text}: {onClick: () => void, text: string}) {
  return (
    <StyledButton onClick={onClick}>
      {text}
    </StyledButton>
  )}
